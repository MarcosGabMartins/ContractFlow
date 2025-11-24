"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { BarChart3, PieChart, CalendarOff, PackageCheck } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

export default function RelatoriosPage() {
const [reportType, setReportType] = useState("due");
const [data, setData] = useState<any>(null);

// Fetch genérico baseado no tipo selecionado
useEffect(() => {
    const fetchReport = async () => {
        let endpoint = "";
        if (reportType === "due") endpoint = "/api/reports/due-deliverables";
        if (reportType === "status") endpoint = "/api/reports/contract-status";
        
        if(endpoint) {
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`);
            if(res.ok) setData(await res.json());
        } catch (e) { console.error(e); }
        }
    }
    fetchReport();
}, [reportType]);

return (
    <div className="flex h-screen bg-background">
    <Sidebar />
    <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Relatórios Gerenciais</h1>
            <p className="text-muted-foreground">Métricas consolidadas da gestão contratual</p>
        </div>

        {/* Seletor de Relatórios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button onClick={() => setReportType("due")} className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${reportType === "due" ? "bg-primary text-white border-primary" : "bg-white hover:bg-gray-50"}`}>
                <CalendarOff size={24} />
                <div><div className="font-bold">Entregas Atrasadas</div><div className="text-xs opacity-80">Itens vencidos</div></div>
            </button>
            <button onClick={() => setReportType("status")} className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${reportType === "status" ? "bg-primary text-white border-primary" : "bg-white hover:bg-gray-50"}`}>
                <PieChart size={24} />
                <div><div className="font-bold">Status Contratos</div><div className="text-xs opacity-80">Visão geral</div></div>
            </button>
            {/* Adicione botões para os outros endpoints aqui */}
        </div>

        {/* Visualização dos Dados */}
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[400px]">
            {reportType === "due" && data && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Entregáveis Vencidos</h2>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="p-3">Contrato</th>
                                <th className="p-3">Descrição</th>
                                <th className="p-3">Data Prevista</th>
                                <th className="p-3">Dias Atraso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item: any, i: number) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="p-3 font-medium">{item.officialNumber}</td>
                                    <td className="p-3">{item.description}</td>
                                    <td className="p-3">{new Date(item.expectedDate).toLocaleDateString()}</td>
                                    <td className="p-3 text-red-600 font-bold">{item.daysOverdue} dias</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length === 0 && <p className="text-center text-gray-500 py-10">Nenhum atraso encontrado.</p>}
                </div>
            )}

            {reportType === "status" && data && (
                <div className="flex flex-wrap gap-4">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="p-6 border rounded-xl bg-gray-50 min-w-[200px]">
                            <p className="text-gray-500 uppercase text-sm">{key}</p>
                            <p className="text-3xl font-bold text-primary">{String(value)}</p>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </main>
    </div>
    )
}