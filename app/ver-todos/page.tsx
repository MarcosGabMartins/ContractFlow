"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import ContractCard from "@/components/contract-card"

export default function VerTodos() {
  const [contracts] = useState([
    {
      id: "CT-2024-001",
      status: "ATIVO",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      date: "Vence: 2024-12-15",
    },
    {
      id: "CT-2024-002",
      status: "ATIVO",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      date: "Vence: 2024-12-15",
    },
    {
      id: "CT-2024-003",
      status: "ATIVO",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      date: "Vence: 2024-12-15",
    },
    {
      id: "CT-2024-004",
      status: "ATIVO",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      date: "Vence: 2024-12-15",
    },
    {
      id: "CT-2024-005",
      status: "ATIVO",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      date: "Vence: 2024-12-15",
    },
    {
      id: "CT-2024-006",
      status: "ATIVO",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      date: "Vence: 2024-12-15",
    },
  ])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">DashBoard</h1>
            <p className="text-muted-foreground">Visão geral do sistema de contratos</p>
          </div>

          {/* All Contracts */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Contratos recentes</h2>
              <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
                ← Voltar
              </Link>
            </div>
            <div className="space-y-4">
              {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
