interface Contract {
  id: string
  status: string
  company: string
  unit: string
  value: string
  date: string
  hasDelay?: boolean // Novo campo
}

interface ContractCardProps {
  contract: Contract
}

export default function ContractCard({ contract }: ContractCardProps) {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow ${
      contract.hasDelay 
        ? "bg-red-50 border-red-200" // Fundo vermelho se tiver atraso
        : "bg-white border-border"
    }`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`font-semibold ${contract.hasDelay ? "text-red-700" : "text-foreground"}`}>
            {contract.id}
          </span>
          
          {/* Se tiver atraso, mostra etiqueta de Alerta, senão mostra o status normal */}
          {contract.hasDelay ? (
             <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
               🚨 Com Atraso
             </span>
          ) : (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              {contract.status}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{contract.company}</p>
        <p className="text-xs text-muted-foreground">{contract.unit}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">{contract.value}</p>
        <p className="text-xs text-muted-foreground">{contract.date}</p>
      </div>
    </div>
  )
}