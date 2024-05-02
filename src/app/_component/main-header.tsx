'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link,
} from '@yamada-ui/react'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'

type Path = 'friends' | 'events'
const pathMap: Record<Path, string> = {
  friends: '/friends',
  events: '/events',
}

export function MainHeader() {
  const pathname = usePathname()
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment !== '') as Path[]
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 w-full bg-gray-900 text-white">
      <Breadcrumb>
        <BreadcrumbItem isCurrentPage={pathSegments.length === 0}>
          <BreadcrumbLink className="text-gray-400 hover:text-white" href="/">
            home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((path, i) => (
          <BreadcrumbItem key={path} isCurrentPage={i === pathSegments.length - 1}>
            <BreadcrumbLink
              className="text-gray-400 hover:text-white"
              href={pathMap[path]}
            >
              {path}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Link className="flex items-center text-white" href="/">
        <span className="text-lg font-semibold">ヒトゴト</span>
      </Link>
      <FiLogOut className="cursor-pointer" size={30} onClick={() => signOut()} />
    </header>
  )
}
