import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return <div className="flex text-red-400">{<UserButton afterSignOutUrl="/" />}</div>
}
