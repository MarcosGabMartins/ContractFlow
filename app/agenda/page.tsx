"use client"

import Sidebar from "@/components/sidebar"
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function AgendaPrazosPage() {
  const [events] = useState([
    {
      id: 1,
      title: "Vencimento - CT-2024-001",
      date: "2024-12-15",
      time: "23:59",
      status: "Crítico",
      statusColor: "bg-red-100 text-red-800",
      daysLeft: 52,
      contract: "CT-2024-001",
    },
    {
      id: 2,
      title: "Revisão Contratual - CT-2024-002",
      date: "2024-11-30",
      time: "09:00",
      status: "Atenção",
      statusColor: "bg-yellow-100 text-yellow-800",
      daysLeft: 37,
      contract: "CT-2024-002",
    },
    {
      id: 3,
      title: "Inspeção Programada - CT-2024-003",
      date: "2024-11-10",
      time: "14:00",
      status: "Planejado",
      statusColor: "bg-blue-100 text-blue-800",
      daysLeft: 17,
      contract: "CT-2024-003",
    },
    {
      id: 4,
      title: "Renovação - CT-2024-004",
      date: "2024-10-28",
      time: "10:00",
      status: "Concluído",
      statusColor: "bg-green-100 text-green-800",
      daysLeft: -5,
      contract: "CT-2024-004",
    },
  ])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Agenda de Prazos</h1>
            <p className="text-muted-foreground">Acompanhe datas importantes e prazos dos contratos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Próximos 7 dias</p>
                  <p className="text-3xl font-bold text-primary">2</p>
                </div>
                <AlertCircle size={32} className="text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Próximos 30 dias</p>
                  <p className="text-3xl font-bold text-primary">5</p>
                </div>
                <Calendar size={32} className="text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Atrasados</p>
                  <p className="text-3xl font-bold text-red-500">1</p>
                </div>
                <AlertCircle size={32} className="text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Concluídos</p>
                  <p className="text-3xl font-bold text-green-500">12</p>
                </div>
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Cronograma de Eventos</h2>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar size={20} className="text-primary" />
                    </div>
                    {index < events.length - 1 && <div className="w-1 h-12 bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.statusColor}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {event.time}
                      </div>
                      <div className="font-medium">{event.daysLeft > 0 ? `${event.daysLeft} dias` : "Vencido"}</div>
                      <span className="text-primary font-medium">{event.contract}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
