'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@yamada-ui/react'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { FaAngleRight, FaHome } from 'react-icons/fa'
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
    <header className="sticky top-0 flex h-16 items-center justify-between px-4 md:px-6 w-full bg-gray-900 text-white">
      <Breadcrumb separator={<FaAngleRight />}>
        <BreadcrumbItem isCurrentPage={pathSegments.length === 0}>
          <BreadcrumbLink className="text-gray-400 hover:text-white" href="/">
            <FaHome />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((path, i) => (
          <BreadcrumbItem
            key={path}
            isCurrentPage={i === pathSegments.length - 1}
          >
            <BreadcrumbLink className="w-14 truncate" href={pathMap[path]}>
              {path}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <FiLogOut
        className="cursor-pointer"
        size={30}
        onClick={() => signOut()}
      />
    </header>
  )
}
