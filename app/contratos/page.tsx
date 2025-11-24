"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { Search, Eye, Trash2, Plus, CheckSquare, AlertTriangle, Scale, ClipboardCheck, UploadCloud } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { 
  ContractSimpleDto, ContractDetailsDto, CreateObligationRequest, 
  CreateDeliverableRequest, RegisterNonComplianceRequest, ApplyPenaltyRequest,
  CreateInspectionRequest
} from "@/lib/api-types"

interface ContractSearchResult {
  id: string;
  officialNumber: string;
  status: string;
  statusColor: string;
  company: string;
}

export default function ContratosPage() {
  // ... (Mantenha os estados existentes: activeTab, searchTerm, etc.)
  const [activeTab, setActiveTab] = useState("search")
  const [searchTerm, setSearchTerm] = useState("");
  const [allContracts, setAllContracts] = useState<ContractSearchResult[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ContractSearchResult[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetailsDto | null>(null);
  const [detailsTab, setDetailsTab] = useState("info");
  
  // Modais
  const [activeModal, setActiveModal] = useState<"deliverable" | "noncompliance" | "penalty" | "inspection" | "evidence" | null>(null);
  
  // IDs selecionados
  const [selectedObligationId, setSelectedObligationId] = useState("");
  const [selectedNcId, setSelectedNcId] = useState("");
  const [selectedDeliverableId, setSelectedDeliverableId] = useState(""); // NOVO

  // Forms
  const [showObliForm, setShowObliForm] = useState(false);
  const [newObligation, setNewObligation] = useState<CreateObligationRequest>({ clauseRef: "", description: "", dueDate: "", status: "Pendente" });
  const [newDeliverable, setNewDeliverable] = useState<CreateDeliverableRequest>({ expectedDate: "", quantity: 0, unit: "" });
  const [newNonCompliance, setNewNonCompliance] = useState<RegisterNonComplianceRequest>({ reason: "", severity: "Baixo" });
  const [newPenalty, setNewPenalty] = useState<ApplyPenaltyRequest>({ type: "Multa", legalBasis: "", amount: 0 });
  
  // NOVOS ESTADOS PARA FISCALIZAÇÃO
  const [newInspection, setNewInspection] = useState<CreateInspectionRequest>({ date: "", inspector: "", notes: "" });
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  // ... (Mantenha getStatusColor, fetchDetails, fetchContracts, useEffects, handleAddObligation, handleDeleteObligation) ...
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
      fetchDetails();
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

  // ... (Mantenha handleCreateDeliverable, handleMarkDelivered, handleRegisterNonCompliance, handleApplyPenalty) ...
  const handleCreateDeliverable = async () => {
    if (!selectedObligationId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/obligations/${selectedObligationId}/deliverables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeliverable)
      });
      if (!res.ok) throw new Error();
      setActiveModal(null);
      fetchDetails();
      alert("Entregável criado!");
    } catch { alert("Erro ao criar entregável"); }
  };

  const handleMarkDelivered = async (deliverableId: string) => {
    if (!confirm("Confirmar entrega realizada hoje?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/deliverables/${deliverableId}/delivered`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveredAt: new Date().toISOString() })
      });
      if (!res.ok) throw new Error();
      fetchDetails();
    } catch { alert("Erro ao marcar entrega"); }
  };

  const handleRegisterNonCompliance = async () => {
    if (!selectedObligationId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/obligations/${selectedObligationId}/noncompliances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNonCompliance)
      });
      if (!res.ok) throw new Error();
      setActiveModal(null);
      fetchDetails();
      alert("Não conformidade registrada!");
    } catch { alert("Erro ao registrar"); }
  };

  const handleApplyPenalty = async () => {
    if (!selectedNcId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/noncompliances/${selectedNcId}/penalties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPenalty)
      });
      if (!res.ok) throw new Error();
      setActiveModal(null);
      fetchDetails();
      alert("Penalidade aplicada!");
    } catch { alert("Erro ao aplicar penalidade"); }
  };

  // --- NOVAS FUNÇÕES DE FISCALIZAÇÃO ---

  const handleRegisterInspection = async () => {
    if (!selectedDeliverableId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/deliverables/${selectedDeliverableId}/inspections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newInspection,
            date: newInspection.date || new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error();
      setActiveModal(null);
      setNewInspection({ date: "", inspector: "", notes: "" });
      alert("Inspeção registrada!");
    } catch { alert("Erro ao registrar inspeção."); }
  };

  const handleUploadEvidence = async () => {
    if (!selectedDeliverableId || !evidenceFile) return;
    const formData = new FormData();
    formData.append("File", evidenceFile);
    formData.append("notes", "Evidência anexada via web");

    try {
      const res = await fetch(`${API_BASE_URL}/api/deliverables/${selectedDeliverableId}/evidences`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error();
      setActiveModal(null);
      setEvidenceFile(null);
      alert("Evidência enviada!");
    } catch { alert("Erro no upload de evidência."); }
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
            {/* ... (Mantenha a barra de busca e lista de contratos) ... */}
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
              {["info", "obligations", "execution"].map(t => (
                <button key={t} onClick={() => setDetailsTab(t)} className={`px-4 py-2 font-medium capitalize ${detailsTab === t ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}>
                  {t === "info" ? "Informações" : t === "obligations" ? "Obrigações" : "Execução & Fiscalização"}
                </button>
              ))}
            </div>

            {/* ... (Aba Info e Obligations mantidas) ... */}
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
                    {/* Form Obrigação */}
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

            {detailsTab === 'execution' && (
              <div className="space-y-8">
                {contractDetails.obligations.map(ob => (
                  <div key={ob.id} className="border rounded-xl p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="font-bold text-lg text-gray-800">Obrigação: {ob.description}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedObligationId(ob.id); setActiveModal("deliverable"); }} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1">
                          <Plus size={14} /> Add Entregável
                        </button>
                        <button onClick={() => { setSelectedObligationId(ob.id); setActiveModal("noncompliance"); }} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 flex items-center gap-1">
                          <AlertTriangle size={14} /> Reportar Falha
                        </button>
                      </div>
                    </div>

                    {/* Lista de Entregáveis */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Entregas e Fiscalização</h4>
                      {ob.deliverables.length === 0 ? <p className="text-sm text-gray-400">Nenhum entregável definido.</p> : (
                        <div className="space-y-2">
                          {ob.deliverables.map(dev => (
                            <div key={dev.id} className="bg-white border p-3 rounded flex justify-between items-center">
                              <div>
                                <span className="font-medium">{dev.quantity} {dev.unit}</span>
                                <span className="text-sm text-gray-500 mx-2">|</span>
                                <span className="text-sm text-gray-500">Previsto: {new Date(dev.expectedDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                 {/* Botões de Fiscalização */}
                                <button onClick={() => { setSelectedDeliverableId(dev.id); setActiveModal("inspection"); }} className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 flex gap-1" title="Registrar Inspeção">
                                    <ClipboardCheck size={14}/> Insp.
                                </button>
                                <button onClick={() => { setSelectedDeliverableId(dev.id); setActiveModal("evidence"); }} className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 flex gap-1" title="Anexar Evidência">
                                    <UploadCloud size={14}/> Evid.
                                </button>

                                {dev.deliveredAt ? (
                                    <span className="text-green-600 text-sm font-bold flex items-center gap-1 px-2"><CheckSquare size={16}/> Entregue</span>
                                ) : (
                                    <button onClick={() => handleMarkDelivered(dev.id)} className="text-sm bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100">Confirmar</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lista de Não Conformidades */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Histórico de Falhas</h4>
                      {ob.nonCompliances.length === 0 ? <p className="text-sm text-gray-400">Nenhuma falha registrada.</p> : (
                        <div className="space-y-2">
                          {ob.nonCompliances.map(nc => (
                            <div key={nc.id} className="bg-red-50 border border-red-100 p-3 rounded">
                              <div className="flex justify-between">
                                <p className="font-bold text-red-800">{nc.severity} - {nc.reason}</p>
                                {!nc.penalty && (
                                  <button onClick={() => { setSelectedNcId(nc.id); setActiveModal("penalty"); }} className="text-xs bg-red-800 text-white px-2 py-1 rounded flex items-center gap-1">
                                    <Scale size={12} /> Aplicar Penalidade
                                  </button>
                                )}
                              </div>
                              {nc.penalty && (
                                <div className="mt-2 text-xs bg-white/50 p-2 rounded text-red-900">
                                  <strong>Penalidade Aplicada:</strong> {nc.penalty.type} (R$ {nc.penalty.amount})
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- MODAIS --- */}
        
        {/* Modal Entregável */}
        {activeModal === "deliverable" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold mb-4">Novo Entregável</h3>
              <input type="date" className="w-full border p-2 rounded mb-2" onChange={e => setNewDeliverable({...newDeliverable, expectedDate: e.target.value})} />
              <input type="number" placeholder="Quantidade" className="w-full border p-2 rounded mb-2" onChange={e => setNewDeliverable({...newDeliverable, quantity: Number(e.target.value)})} />
              <input type="text" placeholder="Unidade (ex: Relatório, Km)" className="w-full border p-2 rounded mb-4" onChange={e => setNewDeliverable({...newDeliverable, unit: e.target.value})} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button onClick={handleCreateDeliverable} className="px-4 py-2 bg-primary text-white rounded">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Não Conformidade */}
        {activeModal === "noncompliance" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold mb-4">Registrar Falha</h3>
              <input type="text" placeholder="Motivo" className="w-full border p-2 rounded mb-2" onChange={e => setNewNonCompliance({...newNonCompliance, reason: e.target.value})} />
              <select className="w-full border p-2 rounded mb-4" onChange={e => setNewNonCompliance({...newNonCompliance, severity: e.target.value})}>
                <option value="Baixo">Baixo</option><option value="Médio">Médio</option><option value="Alto">Alto</option>
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button onClick={handleRegisterNonCompliance} className="px-4 py-2 bg-red-600 text-white rounded">Registrar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Penalidade */}
        {activeModal === "penalty" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold mb-4">Aplicar Penalidade</h3>
              <select className="w-full border p-2 rounded mb-2" onChange={e => setNewPenalty({...newPenalty, type: e.target.value})}>
                <option value="Multa">Multa</option><option value="Advertência">Advertência</option><option value="Suspensão">Suspensão</option>
              </select>
              <input type="text" placeholder="Base Legal (Cláusula)" className="w-full border p-2 rounded mb-2" onChange={e => setNewPenalty({...newPenalty, legalBasis: e.target.value})} />
              <input type="number" placeholder="Valor (R$)" className="w-full border p-2 rounded mb-4" onChange={e => setNewPenalty({...newPenalty, amount: Number(e.target.value)})} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button onClick={handleApplyPenalty} className="px-4 py-2 bg-red-800 text-white rounded">Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Inspeção (NOVO) */}
        {activeModal === "inspection" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold mb-4">Registrar Inspeção</h3>
              <input type="date" className="w-full border p-2 rounded mb-2" onChange={e => setNewInspection({...newInspection, date: e.target.value})} />
              <input type="text" placeholder="Fiscal Responsável" className="w-full border p-2 rounded mb-2" onChange={e => setNewInspection({...newInspection, inspector: e.target.value})} />
              <textarea placeholder="Notas da Vistoria..." className="w-full border p-2 rounded mb-4" onChange={e => setNewInspection({...newInspection, notes: e.target.value})} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button onClick={handleRegisterInspection} className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Evidência (NOVO) */}
        {activeModal === "evidence" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold mb-4">Anexar Evidência</h3>
              <div className="border-2 border-dashed border-gray-300 p-8 rounded text-center cursor-pointer hover:bg-gray-50 mb-4">
                 <input type="file" onChange={e => e.target.files && setEvidenceFile(e.target.files[0])} />
                 <p className="text-xs text-gray-500 mt-2">Selecione foto ou documento</p>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button onClick={handleUploadEvidence} disabled={!evidenceFile} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">Enviar</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}