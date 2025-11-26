"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import StatCard from "@/components/stat-card"
import ContractCard from "@/components/contract-card"
import { API_BASE_URL } from "@/lib/config"
import { ContractSimpleDto, DueDeliverableReportDto } from "@/lib/api-types"

interface Contract {
  id: string;
  status: string;
  company: string;
  unit: string;   
  value: string;  
  date: string;
  hasDelay?: boolean;   
}

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState({ active: 0, overdue: 0, total: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca Contratos e Relatórios em paralelo
        const [contractsRes, statusRes, dueRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/contracts`),
            fetch(`${API_BASE_URL}/api/reports/contract-status`),
            fetch(`${API_BASE_URL}/api/reports/due-deliverables`)
        ]);

        if (!contractsRes.ok) throw new Error("Falha ao buscar contratos");

        const contractsData: ContractSimpleDto[] = await contractsRes.json();
        const statusData = statusRes.ok ? await statusRes.json() : [];
        const dueData: DueDeliverableReportDto[] = dueRes.ok ? await dueRes.json() : [];

        // 2. Cria um conjunto (Set) com os IDs dos contratos que têm atraso
        const overdueContractIds = new Set(dueData.map(d => d.contractId));

        // 3. Mapeia os contratos verificando se o ID está na lista de atrasos
        const mappedContracts: Contract[] = contractsData.slice(0, 5).map(c => ({
          id: c.officialNumber,
          status: c.status,
          company: `ID: ${c.id.substring(0, 8)}...`,
          unit: "N/A",
          value: "N/A",
          date: "Recente",
          hasDelay: overdueContractIds.has(c.id) // Define se pinta de vermelho
        }));
        
        setContracts(mappedContracts);

        // 4. Estatísticas
        const activeCount = Array.isArray(statusData) 
            ? statusData.find((s: any) => s.status === "Active")?.count || 0 
            : 0;
            
        const overdueCount = dueData.length;

        setStats({ active: activeCount, overdue: overdueCount, total: contractsData.length });

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral em tempo real</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Contratos Ativos" 
              value={stats.active.toString()} 
              icon="📋" 
              color="text-blue-600" 
              iconBg="bg-blue-500" 
            />
            <StatCard 
              title="Total de Contratos" 
              value={stats.total.toString()} 
              icon="Vg" 
              color="text-orange-600" 
              iconBg="bg-orange-500" 
            />
            <StatCard 
              title="Itens em Atraso" 
              value={stats.overdue.toString()} 
              icon="🚨" 
              color="text-red-600" 
              iconBg="bg-red-500" 
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Contratos Recentes</h2>
              <Link href="/ver-todos" className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver Todos
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