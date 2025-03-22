'use client'

import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { user, error, isLoading } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="w-full bg-[#f3f7f4] shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-20">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-bold text-[#2a9d8f]">
              Echo
            </Link>
          </div>

          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            <Link href="/services" className="text-sm hover:underline text-[#1d3557]">
              Services
            </Link>
            <Link href="/schedule" className="text-sm hover:underline text-[#1d3557]">
              Schedule
            </Link>
            <Link href="/doctors" className="text-sm hover:underline text-[#1d3557]">
              Be a Doctor
            </Link>
            <Link href="/contact" className="text-sm hover:underline text-[#1d3557]">
              Contact
            </Link>
          </div>

          {/* Right side - Auth buttons/Profile */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {error && (
              <div className="text-red-500">Authentication Error</div>
            )}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    href="/api/auth/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/api/auth/login"
                className="rounded-full bg-[#2a9d8f] text-[#f3f7f4] px-8 py-3 text-base font-semibold hover:bg-[#249177] transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="/services" className="block px-3 py-2 text-[#1d3557] hover:bg-gray-100">
            Services
          </a>
          <Link href="/schedule" className="block px-3 py-2 text-[#1d3557] hover:bg-gray-100">
            Schedule
          </Link>
          <Link href="/doctors" className="block px-3 py-2 text-[#1d3557] hover:bg-gray-100">
            Be a Doctor
          </Link>
          <a href="#contact" className="block px-3 py-2 text-[#1d3557] hover:bg-gray-100">
            Contact
          </a>
          {error && (
            <div className="px-3 py-2 text-red-500">Authentication Error</div>
          )}
          {isLoading ? (
            <div className="px-3 py-2">
              <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ) : user ? (
            <>
              <div className="px-3 py-2 text-gray-600">
                Signed in as: {user.name || 'User'}
              </div>
              <Link
                href="/api/auth/logout"
                className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Logout
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/login"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
