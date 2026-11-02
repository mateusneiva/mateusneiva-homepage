## A simple home for Minecraft Java

Licht Launcher started from a direct idea: bring game versions, modpacks, and profiles together in a clean interface, for Windows and Linux. It is an unofficial launcher with no affiliation with Mojang or Microsoft, and it does not redistribute game files: everything comes from Mojang's servers and is verified before use.

The goal is the install-and-play experience of the official launcher, plus what usually takes several tools: mod loader selection, modpack discovery, automatic Java setup, and separate profiles, each in its own folder. Vanilla and modded setups never mix.

<!-- image: launcher overview, with the instance list in the sidebar -->

The project is an *Early Release*. The README says so explicitly, and it applies to this text too: what follows describes real decisions and problems, but the product is still being refined.

## Architecture: a core that knows nothing about the interface

The repository is a Cargo workspace with three layers, and the most important rule is the direction of the dependencies.

- **`licht-core`** holds all the logic: manifests, downloads, Java, game execution, instances, authentication, loaders, and modpacks. It is a Rust library with no Tauri dependency.
- **`src-tauri`** is a thin layer with only typed commands and events that call the core. No business rules live there.
- **`src`** is the React and TypeScript interface. It has no Minecraft logic, only screens and calls to the commands.

This split has a practical consequence: the core can be tested on its own and also powers a CLI, `licht`, which lists versions, installs, and launches the game. The app and the CLI use the same services, so a problem reproduced on the command line is the same problem the interface has.

Communication follows a single flow. The frontend calls typed commands, and progress comes back through events throttled to about 100 ms, so large downloads do not flood the interface. Types shared between Rust and TypeScript are generated with `ts-rs` and never duplicated by hand, which removes a whole class of drift between the two sides. On the React side, TanStack Query handles caching, loading, and errors for the commands.

<!-- image: download/install screen showing the progress of an instance -->

## Challenges

### More than a decade of versions

Supporting versions from 1.5.2 to 26.x means dealing with formats that changed several times. Through 1.12.2, game arguments are a single string; from 1.13 on, they are lists with conditional rules that the core must evaluate. The Java version varies too: Licht reads the major version declared in the game version's JSON and, only when it is missing, falls back to a rule based on the version id.

Some cases were very specific:

- **The game directory on 1.5.2.** The client uses LaunchWrapper, which applies `--gameDir` only after the client thread has already read options from the default directory. Passing the argument alone is not enough. Licht uses `<instance>/.minecraft` and points `APPDATA` and `user.home` at its parent, so the default directory and `--gameDir` coincide. The approach follows HMCL, which redirects those variables, and avoids Prism's, which relies on a legacy Java launcher: Licht ships no Java launcher of its own.
- **Old assets.** Old clients expect logical names such as `sounds/random/click.ogg`. If only hashed files exist, the game starts without sound and tries an endpoint that no longer exists. For those indexes, launch copies the objects to their logical paths.
- **Natives.** Each version declares its native libraries differently. Licht extracts them into a cached folder identified by a fingerprint of the platform and the extraction rules, and reuses whatever has not changed. On 26.x, LWJGL 3.4 asks for `${natives_directory}/java`, and since extraction flattens paths, the argument is rewritten to the right folder.
- **Log encoding.** A read error on `INFORMAÇÕES` in a Windows log showed that decoding everything as UTF-8 was fragile. Now the decoder chooses by Java version and, on Windows with older Java, by code page, replacing invalid bytes instead of stopping the read.

<!-- image: console/logs screen of a running instance -->

### Forge and NeoForge

Fabric and Quilt are relatively simple: the core queries each one's API, downloads the loader profile, and resolves the SHA1 of the Maven libraries. Forge and NeoForge are a different story, because the official installer runs *processors*, programs that generate client files.

Licht reproduces that pipeline itself: it downloads the installer and verifies the published SHA1, reads `install_profile.json`, installs the inherited vanilla version, resolves the client data, runs each processor in sequence without going through a shell, and checks the hashes of the outputs. Mojang's mappings go through Licht's verified downloader instead of letting the processor fetch them unchecked.

At the end, the core writes a receipt with the hashes of the profile, the client JAR, the libraries, and the generated files. A valid receipt skips the whole pipeline next time, and a missing or modified one is repaired by running Install/Repair again. One Windows detail cost time: Rust's `canonicalize` returns paths with a `\\?\` prefix, which Java's classpath reader rejects. Paths are now made absolute without that prefix.

### Downloads you can trust

Everything downloaded has its hash verified, and origins are restricted. Modrinth packs only accept the `cdn.modrinth.com` host, including redirects. For CurseForge, three CDN hosts are allowed and every redirect is checked again. Paths inside packs are validated so they cannot escape the instance, reach the launcher's own files, or use reserved Windows names.

CurseForge brought a behavior decision. When a mod author disables third-party distribution, the API returns an empty `downloadUrl`. Licht does not try to guess the URL: the import stops before creating the instance, and the error names each blocked mod, so the person knows exactly what is missing.

### Microsoft sign-in with no secret in the binary

Sign-in uses the authorization code flow with PKCE, opening the system browser and receiving the redirect on a free local port. Since it is a desktop app, it is a public client: there is no *client secret* to hide, and the client ID embedded in the binary is not a secret. Tokens live in the system keyring (Credential Manager on Windows, Secret Service on Linux), never in a file or a log.

There was also a step outside the code: a new client ID gets HTTP 403 from the Minecraft services until Mojang approves it, so the flow can work in the browser and on Xbox and only fail at the last step. For people without an account, offline mode stays available, with a UUID derived from the player name.

<!-- image: sign-in/accounts screen in settings -->

## Decisions and trade-offs

- **Reimplement the Forge installer instead of running it.** It is more work, but it lets every hash be verified and progress be reported through the same pipeline as the other downloads.
- **SQLite behind a queue.** The database lives in an asynchronous service that receives requests through a 64-slot FIFO queue. When it fills up, callers wait, which applies backpressure instead of piling up unbounded work. SQL queries and transactions stay in the repositories, and file operations stay outside them.
- **Change the content folder only on the next startup.** The destination is saved immediately, but the running process keeps using the old paths. On the next startup, before services start, the launcher copies and verifies SHA1, updates the paths in the database, and only then removes the source. A checkpoint allows resuming if something is interrupted, and different files at the destination become an error, not an overwrite.
- **Hash-based routing.** The interface uses `/#/` so the Tauri window does not need to rewrite paths to `index.html`.
- **Little visual effect.** The interface runs in WebView2 on Windows and WebKitGTK on Linux, so the project avoids `backdrop-filter`, blurs, and complex animations, and tests any modern CSS feature on both.
- **No usage analytics.** Licht does not collect metrics or send crash reports automatically.

## Quality and tests

No automated test depends on the network or a real Microsoft account. The core uses real Mojang JSONs saved as fixtures, temporary databases, and synthetic files, and the integration tests mirror the code's domains. On the frontend, Vitest, Testing Library, and jsdom cover the components.

CI runs lint, types, and tests for the frontend, plus formatting, Clippy, and tests for Rust, and builds Tauri on Windows and Ubuntu. The documentation candidly separates what builds and tests cover from what depends on manual graphical validation.

## Distribution and updates

Each tag produces, in CI, an NSIS installer and a portable build for Windows, an AppImage and a `.deb` for Linux, and a GitHub Release. `0.x` versions are named after a flower in German: 0.2 is Iris, 0.3 is Rose.

Updates use the Tauri updater on top of the releases, with a Minisign signature verified before any installation. The package downloads in the background but is only installed when the person chooses **Restart to update**, and a failure leaves the installed launcher working. It is worth recording what does not exist yet: updater signatures are different from Windows publisher signing, and the project does not claim to have the latter.

<!-- image: settings screen with updates -->

## Where the project stands

The foundation, Mojang data, downloads, Java, execution, interface, instances, sign-in, and mod loader phases are done, although manual validation of the resumable download engine is still in review. Still open are installing, updating, and resolving dependencies for individual mods (listing, enabling, disabling, and removing already work), the MSI and Flatpak formats, and a performance review of startup time, memory, and download speed.

There are also known limits, recorded in the project's own documentation: graphical validation was done on Windows and Linux launch has not been rechecked, and the `${auth_session}` argument stays literal on very old versions such as 1.5.2. The next milestone is a public v1.0.

## So far, and an invitation

I have been really excited building Licht. Every new feature, from a loader that finally installs correctly to an old game version that at last opens with sound, becomes a small milestone, and that is what keeps me coming back to the project every day. There is still a lot to refine, but watching the launcher grow more complete with each step has been the most fun part.

If you play Minecraft Java on Windows or Linux, I would love to see Licht on your machine. It is free, open source, and in Early Release, so your feedback shapes what comes next: open an issue with the launcher version, your operating system, and what happened.

- **Website and downloads:** [licht-launcher.github.io](https://licht-launcher.github.io/)
- **Code on GitHub:** [licht-launcher/licht-launcher](https://github.com/licht-launcher/licht-launcher)
