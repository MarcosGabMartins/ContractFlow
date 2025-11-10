"use client"

import Sidebar from "@/components/sidebar"
import { AlertTriangle, TrendingUp, Shield, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function PainelRiscosPage() {
  const [risks] = useState([
    {
      id: 1,
      title: "Risco de Não Conformidade",
      contract: "CT-2024-001",
      level: "Alto",
      levelColor: "bg-red-100 text-red-800",
      probability: 75,
      impact: 90,
      description: "Fornecedor apresentou 3 não conformidades no último trimestre",
    },
    {
      id: 2,
      title: "Risco Financeiro",
      contract: "CT-2024-002",
      level: "Médio",
      levelColor: "bg-yellow-100 text-yellow-800",
      probability: 45,
      impact: 60,
      description: "Possível aumento de custos devido à inflação",
    },
    {
      id: 3,
      title: "Risco Operacional",
      contract: "CT-2024-003",
      level: "Baixo",
      levelColor: "bg-green-100 text-green-800",
      probability: 20,
      impact: 30,
      description: "Dependência de um único fornecedor para serviços críticos",
    },
    {
      id: 4,
      title: "Risco de Rescisão",
      contract: "CT-2024-004",
      level: "Alto",
      levelColor: "bg-red-100 text-red-800",
      probability: 60,
      impact: 85,
      description: "Contrato próximo do vencimento sem renovação confirmada",
    },
  ])

  const riskMatrix = [
    { level: "Alto", count: 2, color: "bg-red-500" },
    { level: "Médio", count: 1, color: "bg-yellow-500" },
    { level: "Baixo", count: 1, color: "bg-green-500" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Painel de Riscos</h1>
            <p className="text-muted-foreground">Análise e monitoramento de riscos contratuais</p>
          </div>

          {/* Risk Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Riscos Críticos</p>
                  <p className="text-3xl font-bold text-red-500">2</p>
                </div>
                <AlertTriangle size={32} className="text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Riscos Médios</p>
                  <p className="text-3xl font-bold text-yellow-500">1</p>
                </div>
                <AlertCircle size={32} className="text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Riscos Baixos</p>
                  <p className="text-3xl font-bold text-green-500">1</p>
                </div>
                <Shield size={32} className="text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Score Geral</p>
                  <p className="text-3xl font-bold text-primary">6.2/10</p>
                </div>
                <TrendingUp size={32} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Risk Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Detalhamento de Riscos</h2>
                <div className="space-y-4">
                  {risks.map((risk) => (
                    <div
                      key={risk.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{risk.title}</h3>
                          <p className="text-sm text-muted-foreground">{risk.contract}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${risk.levelColor}`}>
                          {risk.level}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-4">{risk.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Probabilidade</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${risk.probability}%` }} />
                          </div>
                          <p className="text-xs font-medium text-foreground mt-1">{risk.probability}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Impacto</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${risk.impact}%` }} />
                          </div>
                          <p className="text-xs font-medium text-foreground mt-1">{risk.impact}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Distribuição de Riscos</h2>
              <div className="space-y-4">
                {riskMatrix.map((item) => (
                  <div key={item.level}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.level}</span>
                      <span className="text-sm font-bold text-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${item.color} h-3 rounded-full`}
                        style={{ width: `${(item.count / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-foreground mb-4">Ações Recomendadas</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Revisar conformidade do fornecedor CT-2024-001</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Iniciar negociação de renovação CT-2024-004</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Avaliar alternativas de fornecedores</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
