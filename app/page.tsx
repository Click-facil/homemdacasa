"use client"

import { useState, useRef } from 'react'
import Image from 'next/image';
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
  const [problemDescription, setProblemDescription] = useState('')
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
      setProblemDescription('') // Limpa a descrição ao selecionar nova foto
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedFile || !preview) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // --- SIMULAÇÃO DE IA ---
      // No futuro, aqui você enviaria a `imagem` e a `problemDescription` para uma IA de verdade.
      // Por agora, vamos simular respostas diferentes baseadas no texto do usuário.
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      let mockAnalysis: AnalysisResult;

      // Simula uma resposta diferente se o usuário digitar "chuveiro"
      if (problemDescription.toLowerCase().includes('chuveiro')) {
        mockAnalysis = {
          problem: "Troca de resistência de chuveiro elétrico",
          difficulty: "Médio",
          tools: ["Chave de fenda", "Alicate"],
          materials: ["Resistência nova (compatível com o modelo)"],
          steps: [
            "DESLIGUE O DISJUNTOR do chuveiro no quadro de força. É MUITO IMPORTANTE!",
            "Abra a tampa do chuveiro, geralmente girando no sentido anti-horário.",
            "Retire a resistência queimada com cuidado, observando a posição dos conectores.",
            "Encaixe a nova resistência exatamente na mesma posição da antiga.",
            "Feche a tampa do chuveiro e aperte bem.",
            "Deixe a água fria correr por alguns segundos antes de ligar o disjuntor.",
            "Ligue o disjuntor e teste o aquecimento da água."
          ],
          tips: ["Verifique a voltagem (110V/220V) da resistência antes de comprar.", "Se não tiver certeza, chame um eletricista."],
          estimatedTime: "20-30 minutos",
          estimatedCost: "R$ 20-40"
        }
      } else {
        // Resposta padrão (vazamento)
        mockAnalysis = {
          problem: "Vazamento em torneira da cozinha",
          difficulty: "Fácil",
          tools: ["Chave inglesa", "Alicate de pressão"],
          materials: ["Vedação de borracha (reparo)", "Fita veda rosca"],
          steps: [
            "Feche o registro geral de água da cozinha ou da casa.",
            "Abra a torneira para retirar a água restante.",
            "Use a chave inglesa para soltar a porca que prende a torneira.",
            "Substitua o reparo (vedação de borracha) gasto por um novo.",
            "Passe fita veda rosca na rosca da torneira antes de montar.",
            "Remonte a torneira, abra o registro e verifique se o vazamento parou."
          ],
          tips: [
            "Tire uma foto do reparo antigo para comprar um igual.",
            "Use um pano entre a chave e a torneira para não arranhar o metal."
          ],
          estimatedTime: "30-45 minutos",
          estimatedCost: "R$ 15-25"
        }
      }

      setAnalysis(mockAnalysis)
    } catch (err) {
      setError("Não foi possível analisar a imagem. Tente novamente.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-click-cta bg-click-cta/10 border-click-cta/20'
      case 'Médio': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' // Amarelo pode ser mantido para alerta
      case 'Difícil': return 'text-red-400 bg-red-400/10 border-red-400/20'       // Vermelho pode ser mantido para perigo
      default: return 'text-click-muted bg-click-muted/10'
    }
  }

  return (
    <div className="min-h-screen font-sans selection:bg-click-primary selection:text-white">
      
      {/* Header - Identidade Click Fácil */}
      <header className="bg-click-bg border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo Click Fácil"
                width={40}
                height={40}
              />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-click-primary uppercase mb-0.5">
                  Click Fácil Apresenta
                </p>
                <h1 className="text-xl font-bold text-white tracking-tight">Homem da Casa</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Intro Section */}
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

        {/* Upload Area */}
        <div className="bg-click-card border border-slate-800 rounded-2xl p-6 mb-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          
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
                
                {/* NOVO: Campo de texto para descrição */}
                <div className="space-y-2 text-left pt-4">
                  <label htmlFor="problem-description" className="flex items-center gap-2 text-sm font-medium text-click-muted">
                    <MessageSquare className="w-4 h-4" />
                    Descreva o problema (opcional):
                  </label>
                  <textarea
                    id="problem-description"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Ex: 'Meu chuveiro não está esquentando' ou 'A torneira está pingando'"
                    className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-click-primary focus:border-click-primary transition-colors"
                    rows={2}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="px-8 py-4 bg-click-cta text-white font-bold rounded-xl hover:bg-click-ctaHover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 w-full md:w-auto justify-center transform hover:-translate-y-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processando Imagem...
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
            ) : (
              <div className="space-y-6 py-10 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <div className="flex justify-center">
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 group-hover:border-click-primary/50 group-hover:bg-slate-800 transition-all duration-300 shadow-xl">
                    <Camera className="w-10 h-10 text-click-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-click-primary transition-colors">
                    Tire uma foto ou carregue um vídeo
                  </h3>
                  <p className="text-click-muted text-sm mb-8">
                    Suportamos JPG, PNG e MP4
                  </p>
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 text-white font-medium group-hover:bg-click-primary group-hover:text-white transition-all duration-300">
                    Selecionar Arquivo <ArrowRight className="w-4 h-4" />
                  </span>
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Main Result Card */}
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

            {/* Tools & Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tools */}
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

              {/* Materials */}
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

            {/* Steps */}
            <div className="bg-click-card border border-slate-800 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-8">Passo a Passo Detalhado</h3>
              <div className="space-y-8">
                {analysis.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 group relative">
                    {/* Linha conectora vertical */}
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

            {/* Tips */}
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
                onClick={() => {setAnalysis(null); setPreview(null); setSelectedFile(null); setProblemDescription('')}}
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