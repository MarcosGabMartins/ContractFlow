"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { Search, Filter, Eye, Trash2, Plus } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { ContractSimpleDto, ContractDetailsDto, CreateObligationRequest } from "@/lib/api-types"

interface ContractSearchResult {
  id: string;
  officialNumber: string;
  status: string;
  statusColor: string;
  company: string;
}

export default function ContratosPage() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchTerm, setSearchTerm] = useState("");
  const [allContracts, setAllContracts] = useState<ContractSearchResult[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ContractSearchResult[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetailsDto | null>(null);
  const [detailsTab, setDetailsTab] = useState("info");
  
  // Estado para nova obrigação
  const [showObliForm, setShowObliForm] = useState(false);
  const [newObligation, setNewObligation] = useState<CreateObligationRequest>({ clauseRef: "", description: "", dueDate: "", status: "Pendente" });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      case "terminated": case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const fetchDetails = async () => {
    if (!selectedContractId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${selectedContractId}`);
      if (!response.ok) throw new Error("Erro");
      const data = await response.json();
      setContractDetails(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/contracts`);
        const data: ContractSimpleDto[] = await response.json();
        const mapped = data.map(c => ({
          id: c.id,
          officialNumber: c.officialNumber,
          status: c.status,
          statusColor: getStatusColor(c.status),
          company: `ID: ${c.id.substring(0, 8)}...`
        }));
        setAllContracts(mapped);
        setFilteredContracts(mapped);
      } catch (error) { console.error(error); }
    };
    fetchContracts();
  }, []);

  useEffect(() => {
    if (!searchTerm) { setFilteredContracts(allContracts); return; }
    setFilteredContracts(allContracts.filter(c => c.officialNumber.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, allContracts]);

  useEffect(() => {
    if (activeTab === "details" && selectedContractId) { fetchDetails(); setDetailsTab("info"); }
  }, [activeTab, selectedContractId]);

  const handleAddObligation = async () => {
    if (!selectedContractId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/contracts/${selectedContractId}/obligations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newObligation)
      });
      if (!res.ok) throw new Error("Erro ao adicionar");
      setShowObliForm(false);
      setNewObligation({ clauseRef: "", description: "", dueDate: "", status: "Pendente" });
      fetchDetails(); // Refresh
      alert("Obrigação adicionada!");
    } catch (e) { alert("Erro ao salvar obrigação."); }
  };

  const handleDeleteObligation = async (id: string) => {
    if(!confirm("Excluir obrigação?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/obligations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro");
      fetchDetails();
    } catch (e) { alert("Erro ao excluir."); }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Buscar Contratos</h1>
          <p className="text-muted-foreground">Pesquise e gerencie obrigações contratuais</p>
        </div>

        {activeTab === "search" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex gap-4">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4">
                <Search size={20} className="text-gray-400" />
                <input type="text" placeholder="Buscar por Nº Oficial" className="flex-1 bg-transparent outline-none text-sm py-3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <div key={contract.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md cursor-pointer flex justify-between items-center" onClick={() => { setSelectedContractId(contract.id); setActiveTab("details"); }}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contract.statusColor}`}>{contract.status}</span>
                        <span className="font-semibold">{contract.officialNumber}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">ID: {contract.id}</p>
                    </div>
                    <Eye size={18} className="text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && contractDetails && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <button onClick={() => setActiveTab("search")} className="text-primary text-sm mb-4">← Voltar</button>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{contractDetails.officialNumber}</h2>
              <span className="text-sm text-muted-foreground">{contractDetails.supplierName}</span>
            </div>

            <div className="flex gap-4 border-b mb-6">
              {["info", "obligations", "noncompliance"].map(t => (
                <button key={t} onClick={() => setDetailsTab(t)} className={`px-4 py-2 font-medium capitalize ${detailsTab === t ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}>
                  {t === "info" ? "Informações" : t === "obligations" ? `Obrigações (${contractDetails.obligations.length})` : "Não Conformidades"}
                </button>
              ))}
            </div>

            {detailsTab === 'info' && (
              <div className="grid grid-cols-2 gap-6">
                 <div><p className="text-xs text-gray-500">Fornecedor</p><p className="font-medium">{contractDetails.supplierName}</p></div>
                 <div><p className="text-xs text-gray-500">Valor</p><p className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: contractDetails.currency }).format(contractDetails.totalAmount)}</p></div>
                 <div><p className="text-xs text-gray-500">Vigência</p><p className="font-medium">{new Date(contractDetails.termStart).toLocaleDateString()} - {new Date(contractDetails.termEnd).toLocaleDateString()}</p></div>
                 <div><p className="text-xs text-gray-500">Modalidade</p><p className="font-medium">{contractDetails.modality}</p></div>
              </div>
            )}

            {detailsTab === 'obligations' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => setShowObliForm(!showObliForm)} className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90">
                    <Plus size={16} /> Nova Obrigação
                  </button>
                </div>

                {showObliForm && (
                  <div className="bg-gray-50 p-4 rounded border">
                    <h4 className="font-semibold mb-2 text-sm">Nova Obrigação</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                      <input className="border p-1 rounded text-sm" placeholder="Ref. Cláusula (ex: 2.1)" value={newObligation.clauseRef} onChange={e => setNewObligation({...newObligation, clauseRef: e.target.value})} />
                      <input className="border p-1 rounded text-sm md:col-span-2" placeholder="Descrição" value={newObligation.description} onChange={e => setNewObligation({...newObligation, description: e.target.value})} />
                      <input type="date" className="border p-1 rounded text-sm" value={newObligation.dueDate || ''} onChange={e => setNewObligation({...newObligation, dueDate: e.target.value})} />
                      <button onClick={handleAddObligation} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Salvar</button>
                    </div>
                  </div>
                )}

                {contractDetails.obligations.map(ob => (
                  <div key={ob.id} className="p-4 border rounded-lg flex justify-between items-start group">
                    <div>
                      <h4 className="font-semibold">{ob.clauseRef} - {ob.description}</h4>
                      <p className="text-sm text-muted-foreground">Status: {ob.status} | Vencimento: {ob.dueDate ? new Date(ob.dueDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <button onClick={() => handleDeleteObligation(ob.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {detailsTab === 'noncompliance' && (
              <div>
                 {contractDetails.obligations.flatMap(o => o.nonCompliances).length === 0 && <p className="text-gray-500 italic">Nenhuma não conformidade registrada.</p>}
                 {contractDetails.obligations.flatMap(o => o.nonCompliances).map(nc => (
                    <div key={nc.id} className="p-3 border rounded bg-red-50 border-red-100 mb-2">
                      <p className="font-bold text-red-800">{nc.severity}</p>
                      <p className="text-sm">{nc.reason}</p>
                    </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}