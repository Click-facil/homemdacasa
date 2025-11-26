"use client"

import { useState, useRef } from 'react'
import { Camera, Upload, Wrench, CheckCircle, AlertCircle, Lightbulb, ShoppingCart, ArrowRight, MessageSquare } from 'lucide-react'

// Interface para os resultados
interface AnalysisResult {
  problem: string
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  tools: string[]
  materials: string[]
  steps: string[]
  tips: string[]
  estimatedTime: string
  estimatedCost: string
}

export default function HomemDaCasa() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('') // Novo estado para o texto
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setAnalysis(null)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    // Validação: precisa ter foto OU descrição
    if (!preview && !description) {
        setError("Por favor, envie uma foto ou descreva o problema.")
        return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Prepara os dados
      const payload = {
        image: preview, 
        description: description 
      }

      // CHAMA A SUA API (O arquivo route.ts)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Falha na comunicação com a IA')
      }
      
      // Salva a resposta REAL da IA
      setAnalysis(data)

    } catch (err) {
      console.error(err)
      setError("Erro ao analisar. Verifique sua conexão e a chave de API.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'Médio': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'Difícil': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="min-h-screen font-sans selection:bg-click-primary selection:text-white pb-10">
      
      {/* Header - Identidade Click Fácil */}
      <div className="bg-click-bg border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-click-primary blur opacity-25 rounded-lg group-hover:opacity-50 transition duration-200"></div>
                <div className="relative p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <Wrench className="w-6 h-6 text-click-primary" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-click-primary uppercase mb-0.5">
                  Click Fácil Apresenta
                </p>
                <h1 className="text-xl font-bold text-white tracking-tight">Homem da Casa</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {!analysis && !preview && (
          <div className="text-center mb-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Assistente de <span className="text-click-primary">Reparos Inteligente</span>
            </h2>
            <p className="text-click-muted max-w-xl mx-auto text-lg leading-relaxed">
              Não sabe como consertar? Envie uma foto do problema e nossa Inteligência Artificial guia você passo a passo.
            </p>
          </div>
        )}

        {/* Área de Upload e Descrição */}
        <div className="bg-click-card border border-slate-800 rounded-2xl p-6 mb-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          
          {/* Box da Imagem */}
          <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${preview ? 'border-click-primary/50 bg-click-bg/50' : 'border-slate-700 hover:border-click-primary/50 hover:bg-slate-900/50'}`}>
            
            {preview ? (
              <div className="space-y-6">
                <div className="relative inline-block group">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-w-full max-h-80 mx-auto rounded-lg shadow-lg ring-1 ring-white/10"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 p-2 bg-black/70 text-white rounded-lg hover:bg-click-primary transition-colors backdrop-blur-sm"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-6 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <div className="flex justify-center">
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 group-hover:border-click-primary/50 group-hover:bg-slate-800 transition-all duration-300 shadow-xl">
                    <Camera className="w-10 h-10 text-click-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-click-primary transition-colors">
                    Tire uma foto ou carregue um vídeo
                  </h3>
                  <p className="text-click-muted text-sm">
                    Toque para selecionar
                  </p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* NOVO: Área de Texto (Opcional) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-click-muted mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-click-primary" />
                Descreva o problema (opcional):
            </label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-click-primary focus:border-click-primary outline-none resize-none h-24 transition-all"
                placeholder="Ex: A lâmpada pisca mas não acende, ou o bocal parece solto..."
            />
          </div>

          {/* Botão de Ação */}
          <div className="mt-6 flex justify-center">
            <button
                onClick={analyzeImage}
                disabled={isAnalyzing || (!preview && !description)}
                className="px-8 py-4 bg-click-cta text-white font-bold rounded-xl hover:bg-click-ctaHover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 w-full md:w-auto justify-center transform hover:-translate-y-1"
            >
                {isAnalyzing ? (
                    <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                    </>
                ) : (
                    <>
                    <Lightbulb className="w-5 h-5" />
                    Identificar Solução Agora
                    </>
                )}
            </button>
          </div>

        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Resultados (Analysis) */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="bg-click-card border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-click-primary/10 blur-3xl rounded-full pointer-events-none"></div>
               
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 relative">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Diagnóstico Concluído</h3>
                  <p className="text-xl text-click-primary font-medium">{analysis.problem}</p>
                </div>
                <span className={`px-4 py-2 rounded-lg text-sm font-bold border inline-flex items-center justify-center uppercase tracking-wide ${getDifficultyColor(analysis.difficulty)}`}>
                  Nível {analysis.difficulty}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
                  <h4 className="text-sm font-medium text-click-muted mb-2 uppercase tracking-wider">Tempo Estimado</h4>
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    ⏱️ {analysis.estimatedTime}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
                  <h4 className="text-sm font-medium text-click-muted mb-2 uppercase tracking-wider">Custo Estimado</h4>
                  <p className="text-click-cta font-bold text-lg flex items-center gap-2">
                    💰 {analysis.estimatedCost}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-click-card border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-click-primary/10 rounded-lg">
                    <Wrench className="w-5 h-5 text-click-primary" />
                  </div>
                  Ferramentas
                </h3>
                <ul className="space-y-3">
                  {analysis.tools.map((tool, index) => (
                    <li key={index} className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800/50">
                      <div className="w-2 h-2 rounded-full bg-click-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                      <span className="text-slate-200 font-medium">{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-click-card border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-click-cta/10 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-click-cta" />
                  </div>
                  Materiais
                </h3>
                <ul className="space-y-3">
                  {analysis.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800/50">
                      <CheckCircle className="w-5 h-5 text-click-cta" />
                      <span className="text-slate-200 font-medium">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-click-card border border-slate-800 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-8">Passo a Passo Detalhado</h3>
              <div className="space-y-8">
                {analysis.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 group relative">
                    {index !== analysis.steps.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors -mb-8"></div>
                    )}
                    
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-800 border-2 border-slate-700 text-click-primary rounded-xl flex items-center justify-center text-lg font-bold group-hover:border-click-primary group-hover:bg-click-primary/10 group-hover:scale-110 transition-all duration-300 shadow-lg z-10">
                      {index + 1}
                    </div>
                    <div className="pt-1.5 pb-2">
                      <p className="text-slate-200 leading-relaxed text-lg">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/10 to-orange-900/10 border border-yellow-700/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 flex items-center gap-3">
                <Lightbulb className="w-6 h-6" />
                Dicas de Especialista
              </h3>
              <div className="grid gap-4">
                {analysis.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <span className="text-slate-200">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center pt-8 pb-12">
               <button 
                onClick={() => {setAnalysis(null); setPreview(null); setSelectedFile(null); setDescription('')}}
                className="text-click-muted hover:text-white transition-colors text-sm hover:underline py-2 px-4"
               >
                 Fazer Nova Análise
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}