"use client"

import Sidebar from "@/components/sidebar"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function CadastrarDocsPage() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: "Contrato_CT-2024-001.pdf", size: "2.4 MB", date: "2024-10-20", status: "Processado" },
    { id: 2, name: "Aditivo_CT-2024-001.pdf", size: "1.8 MB", date: "2024-10-19", status: "Processado" },
  ])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Cadastrar Documentos</h1>
            <p className="text-muted-foreground">Faça upload de contratos e documentos relacionados</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                <div className="flex flex-col items-center justify-center py-12">
                  <Upload size={48} className="text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Arraste arquivos aqui</h3>
                  <p className="text-muted-foreground mb-4">ou clique para selecionar</p>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90">
                    Selecionar Arquivo
                  </button>
                  <p className="text-xs text-muted-foreground mt-4">Formatos aceitos: PDF, DOC, DOCX (máx. 10MB)</p>
                </div>
              </div>

              {/* Document Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações do Documento</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tipo de Documento</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Contrato Principal</option>
                      <option>Aditivo</option>
                      <option>Anexo</option>
                      <option>Termo de Rescisão</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contrato Relacionado</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>CT-2024-001</option>
                      <option>CT-2024-002</option>
                      <option>CT-2024-003</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Observações</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Adicione observações sobre o documento..."
                    />
                  </div>
                  <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90">
                    Enviar Documento
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Uploads Recentes</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <FileText size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                        <p className="text-xs text-muted-foreground">{file.date}</p>
                      </div>
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
