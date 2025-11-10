"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import { Search, Filter, Eye, Edit2 } from "lucide-react"

export default function ContratosPage() {
  const [activeTab, setActiveTab] = useState("search")
  const [selectedContract, setSelectedContract] = useState(null)

  const contracts = [
    {
      id: "CT-2024-001",
      status: "ATIVO",
      statusColor: "bg-green-100 text-green-800",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      validity: "2024-02-01 - 2025-09-07",
    },
    {
      id: "CT-2024-002",
      status: "ATIVO",
      statusColor: "bg-green-100 text-green-800",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      validity: "2024-02-01 - 2025-09-07",
    },
    {
      id: "CT-2024-003",
      status: "ATIVO",
      statusColor: "bg-yellow-100 text-yellow-800",
      company: "Fornecedor ABC Ltda",
      unit: "Unidade Centro",
      value: "R$ 45.000,00",
      validity: "2024-02-01 - 2025-09-07",
    },
  ]

  const contractDetails = {
    id: "CT-2024-001",
    company: "Fornecedor ABC Ltda",
    unit: "Unidade Centro",
    value: "R$ 45.000,00",
    validity: "2024-02-01",
    type: "Serviços",
    description: "Prestação de serviços de manutenção predial e limpeza para as instalações da unidade.",
  }

  const obligations = [
    { id: 1, title: "Realizar limpeza diária das áreas comuns", status: "Ativo" },
    { id: 2, title: "Manutenção preventiva mensal dos equipamentos", status: "Ativo" },
  ]

  const inspections = [
    { id: 1, date: "2024-09-15", inspector: "João Silva", progress: 75, status: "Realizada" },
    { id: 2, date: "2024-08-18", inspector: "João Silva", progress: 45, status: "Pendente" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Buscar Contratos</h1>
            <p className="text-muted-foreground">Pesquise e filtre por contratos cadastrados</p>
          </div>

          {activeTab === "search" && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex gap-4">
                <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, fornecedor e unidade"
                    className="flex-1 bg-transparent outline-none text-sm py-3"
                  />
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90">
                  <Filter size={18} />
                  Filtro
                </button>
              </div>

              {/* Results */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Resultados (4)</h2>
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedContract(contract)
                        setActiveTab("details")
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contract.statusColor}`}>
                              {contract.status}
                            </span>
                            <span className="font-semibold text-foreground">{contract.id}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{contract.company}</p>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Fornecedor</p>
                              <p className="font-medium">{contract.company}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Unidade</p>
                              <p className="font-medium">{contract.unit}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Valor</p>
                              <p className="font-medium">{contract.value}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Vigência</p>
                              <p className="font-medium">{contract.validity}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye size={18} className="text-primary" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 size={18} className="text-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && selectedContract && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveTab("search")}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                ← Voltar
              </button>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedContract.id}</h2>
                    <p className="text-muted-foreground">{selectedContract.company}</p>
                  </div>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90">
                    Novo Resultado
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 mb-6">
                  <button className="px-4 py-3 border-b-2 border-primary text-primary font-medium">
                    Informações do contrato
                  </button>
                  <button className="px-4 py-3 text-muted-foreground hover:text-foreground">Obrigações Gerais</button>
                  <button className="px-4 py-3 text-muted-foreground hover:text-foreground">
                    Histórico de Inspeções
                  </button>
                </div>

                {/* Contract Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fornecedor</p>
                    <p className="font-semibold text-foreground">{contractDetails.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                    <p className="font-semibold text-foreground">{contractDetails.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Unidade</p>
                    <p className="font-semibold text-foreground">{contractDetails.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Período de Vigência</p>
                    <p className="font-semibold text-foreground">{contractDetails.validity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <p className="font-semibold text-foreground">{contractDetails.type}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-muted-foreground mb-2">Descrição</p>
                  <p className="text-foreground">{contractDetails.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
