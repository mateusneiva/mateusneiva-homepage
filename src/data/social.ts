import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { IoMailSharp } from 'react-icons/io5'
import { SiMedium, SiX } from 'react-icons/si'
import { MdPictureAsPdf } from 'react-icons/md'

export const socialLinks = [
  { label: 'GitHub', username: 'mateusneiva', href: 'https://github.com/mateusneiva', icon: FaGithub },
  {
    label: 'LinkedIn',
    username: 'mateusfneiva',
    href: 'https://www.linkedin.com/in/mateusfneiva/',
    icon: FaLinkedin,
  },
  { label: 'X', username: 'neonmfa', href: 'https://x.com/neonmfa', icon: SiX },
  { label: 'Instagram', username: 'mateus.fneiva', href: 'https://www.instagram.com/mateus.fneiva', icon: FaInstagram },
  { label: 'Medium', username: 'mateus.fneiva', href: 'https://medium.com/@mateus.fneiva', icon: SiMedium },
] as const
export const ResumeIcon = MdPictureAsPdf
export const EmailIcon = IoMailSharp

export const socialIconLinks = [
  ...socialLinks,
  { label: 'resume', href: '/resume.pdf', icon: ResumeIcon },
] as const
