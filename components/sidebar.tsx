"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/" },
    { label: "Contratos", icon: "📄", href: "/contratos" },
    { label: "Relatórios", icon: "📄", href: "/relatorios" },
    { label: "Cadastrar Docs", icon: "📋", href: "/cadastrar" },
    { label: "Agenda de Prazos", icon: "📅", href: "/agenda" },
    { label: "Painel de Riscos", icon: "⚠️", href: "/riscos" },
  ]

  return (
    <aside className="w- bg-primary text-primary-foreground flex flex-col">
      {/* Logo */}
      <div className="relative w-50 h-50">
            {/* Certifique-se de ter um arquivo 'logo.png' na pasta 'public' */}
            <Image 
              src="/contract.svg" 
              alt="Logo Contract Flow" 
              fill 
              className="object-contain"
            />
          </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary-foreground/20 font-semibold" : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
