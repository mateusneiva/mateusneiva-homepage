import Head from 'next/head';

import { MdEmail } from 'react-icons/md';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

import { Button } from '@/components/Button';

export default function Home() {
  return (
    <>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Mateus Neiva</title>
      </Head>

      <main className="flex flex-col justify-between items-center w-full h-screen bg-background before:content-[''] before:h-16">
        <div className="flex flex-col justify-center items-center w-[430px] px-2 max-md:w-full  max-md:p-5">
          <h1 className="text-7xl font-title text-slate-200 mb-10">
            Mateus Neiva
          </h1>

          <div className="flex justify-center items-center flex-col gap-2 w-full max-md:flex-col">
            <Button className="bg-black text-white" asChild>
              <a
                href="https://github.com/mateusneiva"
                target="_blank"
                className="w-full h-full flex justify-center items-center gap-2"
                rel="noreferrer"
              >
                <BsGithub size={20} />
                Github
              </a>
            </Button>

            <Button className="bg-blue-600 text-white" asChild>
              <a
                href="https://www.linkedin.com/in/mateus-neiva-a120b0210/"
                target="_blank"
                className="w-full h-full flex justify-center items-center gap-2"
                rel="noreferrer"
              >
                <BsLinkedin size={18} />
                Linkedin
              </a>
            </Button>

            <Button className="bg-red-600 text-white" asChild>
              <a
                href="mailto:mateusneiva.dev@gmail.com"
                target="_blank"
                className="w-full h-full flex justify-center items-center gap-2"
                rel="noreferrer"
              >
                <MdEmail size={20} />
                Email
              </a>
            </Button>
          </div>
        </div>
        <p className="bottom-0 p-7 text-slate-200">
          Copyright &copy; {new Date().getFullYear().toString()} Mateus Neiva
        </p>
      </main>
    </>
  );
}
