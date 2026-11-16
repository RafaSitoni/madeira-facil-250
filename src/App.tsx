import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, Calculator, CalendarCheck, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Clock3, CreditCard, Download, Gift, Hammer, Layers, LockKeyhole, Mail, Menu, PaintBucket, Printer,
  Ruler, Scissors, ShieldCheck, Smartphone, Sparkles, Star, TreePine, Wrench, X, XCircle,
} from "lucide-react";
import galeria from "./galeria.json";

// Imagens geradas a partir das fichas e capas aprovadas (ver gen/assets_site.py)
const imgs = import.meta.glob("./assets/{fichas,projetos,capas}/*.webp", { eager: true, import: "default" }) as Record<string, string>;
const img = (p: string) => imgs[`./assets/${p}.webp`];
const num = (n: number) => String(n).padStart(3, "0");
const capa = (c: string) => img(`capas/${c}`);

/* ------------------------------------------------------------------
   CONFIGURAÇÃO — preencha antes de publicar
------------------------------------------------------------------- */
const CONFIG = {
  checkoutEssencial: "", // URL do checkout Hotmart do plano Essencial (R$ 29,90)
  checkoutCompleto: "",  // URL do checkout Hotmart do Pacote Completo (R$ 39,90)
  precoEssencial: "29,90",
  precoCompleto: "39,90",
  garantiaDias: 7,
  emailContato: "",
  termosUrl: "",
  privacidadeUrl: "",
  // Depoimentos: só inclua avaliações reais e autorizadas. Com a lista vazia, a seção não aparece.
  depoimentos: [] as { nome: string; cidade: string; texto: string }[],
};

/** Monta a URL do checkout repassando UTMs e outros parâmetros da página (rastreamento UTMify). */
function checkoutUrl(base: string, origem: string) {
  if (!base) return "";
  const url = new URL(base);
  new URLSearchParams(window.location.search).forEach((v, k) => url.searchParams.set(k, v));
  url.searchParams.set("src", origem);
  return url.toString();
}
function irParaCheckout(base: string, origem: string) {
  const url = checkoutUrl(base, origem);
  if (!url) {
    console.warn("[Madeira Fácil] Checkout não configurado em CONFIG.");
    document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.location.assign(url);
}
const rolarPara = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ------------------------------------------------------------------
   CONTEÚDO
------------------------------------------------------------------- */
const fichas = galeria.carrossel.map((f) => ({ src: img(`fichas/f${num(f.n)}`), nome: f.nome, cat: `Projeto ${num(f.n)} · ${f.nivel}` }));
const projetosGaleria = galeria.projetos.map((p) => ({ src: img(`projetos/t${num(p.n)}`), nome: p.nome, nivel: p.nivel, n: p.n }));

const dores = [
  { titulo: "O vídeo mostra a peça pronta, mas não as medidas", texto: "Você salva, assiste de novo, pausa o vídeo… e continua sem saber o tamanho de cada peça." },
  { titulo: "Madeira comprada errada vira desperdício", texto: "Sem uma lista de cortes, sobra tábua, falta sarrafo e a ida à madeireira se repete." },
  { titulo: "Não fica claro em que ordem montar", texto: "O que vai primeiro? Onde entra cada parafuso? Sem a vista explodida, a montagem vira tentativa e erro." },
];

const metodo = [
  { letra: "M", nome: "Medir", icon: <Ruler />, itens: ["Medidas finais da peça", "Dimensões de cada parte", "Espessuras e quantidades", "Lista de materiais"] },
  { letra: "C", nome: "Cortar", icon: <Scissors />, itens: ["Plano de corte", "Marcação de cada peça", "Ferramentas indicadas", "Dica para pedir os cortes na madeireira"] },
  { letra: "M", nome: "Montar", icon: <Hammer />, itens: ["Vista explodida", "Sequência de montagem", "Fixação e acabamento", "Cuidados de segurança"] },
];

const anatomia = [
  { icon: <Sparkles />, t: "Imagem da peça pronta", d: "Você vê o resultado antes de começar." },
  { icon: <Clock3 />, t: "Nível, tempo e custo", d: "Escolha o projeto certo para o seu momento." },
  { icon: <Layers />, t: "Vista explodida", d: "Como cada parte se encaixa." },
  { icon: <Ruler />, t: "Medidas detalhadas", d: "Cotas de frente e de lado." },
  { icon: <Scissors />, t: "Materiais e cortes", d: "Quantidades e dimensões de cada peça." },
  { icon: <Wrench />, t: "Ferramentas", d: "O que você precisa ter em mãos." },
];

const categorias = [
  { nome: "Prateleiras, nichos e suportes", qtd: 50 },
  { nome: "Decoração e acessórios para casa", qtd: 50 },
  { nome: "Móveis pequenos e organizadores", qtd: 40 },
  { nome: "Jardim, varanda e plantas", qtd: 35 },
  { nome: "Projetos com sobras de madeira", qtd: 30 },
  { nome: "Presentes e peças para vender", qtd: 25 },
  { nome: "Projetos básicos para iniciantes", qtd: 20 },
];

const publico = [
  "Salva vídeos de marcenaria, mas não encontra as medidas",
  "Quer fazer peças de madeira para a própria casa",
  "Está começando e quer projetos do seu nível",
  "Já tem algumas ferramentas e quer novos projetos",
  "Quer aproveitar sobras de madeira",
  "Gosta de criar presentes feitos à mão",
  "Pensa em produzir pequenas peças para vender",
  "Quer decorar com peças personalizadas",
];

const niveis = [
  { n: "01", t: "Iniciante", d: "Poucas peças, montagem simples e ferramentas básicas." },
  { n: "02", t: "Intermediário", d: "Mais etapas, encaixes e um pouco mais de precisão." },
  { n: "03", t: "Avançado", d: "Para quem já executou projetos e quer novos desafios." },
];

const bonus = [
  { icon: <Wrench />, cor: "#2f6b3f", capa: capa("bonus1"), titulo: "Guia de Ferramentas Básicas", desc: "Quais ferramentas os projetos usam, cuidados, faixas de preço e alternativas para começar com pouco." },
  { icon: <PaintBucket />, cor: "#8a5a2b", capa: capa("bonus2"), titulo: "Guia de Acabamento", desc: "Lixamento, seladora, stain, verniz, tinta e qual acabamento usar em cada peça." },
  { icon: <Calculator />, cor: "#3b5a7a", capa: capa("bonus3"), titulo: "Calculadora de Custos", desc: "Planilha que soma madeira, perdas, ferragens e acabamento, e sugere preço de venda." },
  { icon: <CalendarCheck />, cor: "#6b4f8a", capa: capa("bonus4"), titulo: "Plano dos Primeiros 7 Dias", desc: "Roteiro dia a dia, com checklists, para sair do zero até a sua primeira peça pronta." },
  { icon: <TreePine />, cor: "#a3312b", capa: capa("bonus5"), titulo: "Coleção Especial de Natal", desc: "30 projetos natalinos em madeira com medidas: árvores, renas, estrelas, guirlandas e mais." },
];

const recebeEssencial = [
  "250+ projetos de madeira organizados por categoria",
  "Medidas, materiais e planos de corte em cada ficha",
  "Vistas explodidas e orientações de montagem",
  "Níveis iniciante, intermediário e avançado",
  "Acesso digital: celular, computador ou impressão",
];
const recebeCompleto = [
  "Tudo do plano Essencial",
  ...bonus.map((b) => b.titulo),
];

const faqs: [string, string][] = [
  ["O que eu recebo ao comprar?", "Acesso digital à biblioteca com 250+ projetos de madeira em fichas para consultar no celular, no computador ou imprimir. No Pacote Completo você também recebe os 5 bônus."],
  ["Os projetos têm medidas?", "Sim. Cada ficha traz as medidas finais da peça e as dimensões de cada parte, com espessuras e quantidades."],
  ["Os planos de corte estão incluídos?", "Sim. Cada projeto indica as peças que você precisa cortar e como aproveitar o material."],
  ["Preciso ter experiência em marcenaria?", "Não. Os projetos são classificados por nível. Comece pelos de nível iniciante, que têm poucas peças e montagem simples."],
  ["Preciso de ferramentas profissionais?", "Não para começar. Cada ficha mostra as ferramentas necessárias. Muitos projetos usam trena, esquadro, serra, furadeira/parafusadeira e lixa. Alguns projetos avançados pedem ferramentas adicionais."],
  ["Não tenho serra. Consigo fazer?", "Em muitos projetos, sim: você pode levar a lista de cortes para a madeireira e pedir as peças já cortadas nas medidas da ficha."],
  ["Posso ver pelo celular?", "Sim. O material é digital e pode ser aberto no celular, no tablet ou no computador."],
  ["Posso imprimir os projetos?", "Sim. As fichas podem ser impressas para você levar para a sua bancada."],
  ["Posso fabricar as peças para vender?", "Sim, você pode vender as peças de madeira que fabricar. O que não é permitido é revender ou compartilhar os arquivos digitais."],
  ["Como recebo o acesso?", "Assim que o pagamento é confirmado, você recebe por e-mail os dados de acesso. Não enviamos nada pelo correio."],
  ["E se eu não gostar?", `Você tem ${CONFIG.garantiaDias} dias de garantia. Se não ficar satisfeito, pede o reembolso pela própria plataforma de pagamento.`],
  ["Os custos e tempos das fichas são exatos?", "São estimativas. Variam conforme a região, o fornecedor, o tipo de madeira, as ferramentas e a sua experiência."],
];

/* ------------------------------------------------------------------
   COMPONENTES
------------------------------------------------------------------- */
function Cta({ children, onClick, variant = "solid", id }: { children: ReactNode; onClick: () => void; variant?: "solid" | "outline"; id?: string }) {
  return (
    <button id={id} className={`cta cta-${variant} checkout-btn`} onClick={onClick}>
      <span>{children}</span>
      <ArrowRight size={20} />
    </button>
  );
}

function Titulo({ eyebrow, children, desc, light }: { eyebrow: string; children: ReactNode; desc?: string; light?: boolean }) {
  return (
    <div className={`titulo ${light ? "light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{children}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

function CapaBonus({ b, i }: { b: (typeof bonus)[number]; i: number }) {
  if (b.capa) return <img className="capa-img" src={b.capa} alt={`Capa do bônus ${i + 1}: ${b.titulo}`} loading="lazy" />;
  return (
    <div className="capa" style={{ background: b.cor }}>
      <span className="capa-tag">BÔNUS {i + 1}</span>
      <div className="capa-icon">{b.icon}</div>
      <strong>{b.titulo}</strong>
      <span className="capa-marca">MADEIRA FÁCIL</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   PÁGINA
------------------------------------------------------------------- */
export default function App() {
  const [slide, setSlide] = useState(0);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const [menu, setMenu] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pop-up de saída (desktop): aparece uma vez quando o mouse sai pelo topo da janela.
  useEffect(() => {
    let mostrado = false;
    const onLeave = (e: MouseEvent) => {
      if (mostrado || e.clientY > 8 || window.innerWidth < 900) return;
      mostrado = true;
      setPopup(true);
    };
    const t = window.setTimeout(() => document.addEventListener("mouseout", onLeave), 8000);
    return () => { window.clearTimeout(t); document.removeEventListener("mouseout", onLeave); };
  }, []);

  const mover = (d: number) => setSlide((i) => (i + d + fichas.length) % fichas.length);
  const navLinks: [string, string][] = [["metodo", "Como funciona"], ["fichas", "Projetos"], ["bonus", "Bônus"], ["oferta", "Planos"], ["faq", "Dúvidas"]];

  return (
    <>
      <div className="promo-bar">
        <span><Sparkles size={15} /> Oferta de lançamento</span>
        <span className="sep">•</span>
        <span>Pagamento único, sem mensalidade</span>
        <span className="sep hide-sm">•</span>
        <span className="hide-sm">Acesso por e-mail logo após a confirmação</span>
      </div>

      <header className="topbar">
        <div className="container topbar-inner">
          <a href="#inicio" className="brand" aria-label="Madeira Fácil 250+">
            <span className="brand-mark"><Hammer size={20} /></span>
            <span className="brand-text">MADEIRA <b>FÁCIL</b><small>250+ PROJETOS</small></span>
          </a>
          <nav className={menu ? "nav open" : "nav"} aria-label="Navegação principal">
            {navLinks.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
          </nav>
          <button className="top-cta" onClick={() => rolarPara("oferta")}>Ver planos <ArrowRight size={15} /></button>
          <button className="menu-toggle" aria-label={menu ? "Fechar menu" : "Abrir menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="inicio">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="kicker"><span className="dot" /> BIBLIOTECA DIGITAL DE PROJETOS</span>
              <h1>250+ projetos de madeira <em>com medidas prontas</em> para fazer em casa</h1>
              <p className="lead">Pare de adivinhar medidas. Tenha fichas com <b>planos de corte, lista de materiais, vista explodida e montagem passo a passo</b> para construir suas peças.</p>
              <ul className="hero-list">
                <li><CheckCircle2 /> Medidas de cada peça</li>
                <li><CheckCircle2 /> Planos de corte</li>
                <li><CheckCircle2 /> Do iniciante ao avançado</li>
                <li><CheckCircle2 /> Ferramentas em cada ficha</li>
              </ul>
              <Cta onClick={() => rolarPara("oferta")}>QUERO ACESSAR OS 250+ PROJETOS</Cta>
              <div className="reassure">
                <span><LockKeyhole size={15} /> Compra segura</span>
                <span><Mail size={15} /> Acesso por e-mail</span>
                <span><ShieldCheck size={15} /> {CONFIG.garantiaDias} dias de garantia</span>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <img className="hv-main" src={capa("principal")} alt="" />
              <img className="hv-back hv-left" src={fichas[0]?.src} alt="" />
              <img className="hv-back hv-right" src={fichas[2]?.src} alt="" />
              <div className="stamp"><b>250<sup>+</sup></b><span>PROJETOS</span></div>
              <div className="chip chip-a"><Ruler size={16} /> Medidas</div>
              <div className="chip chip-b"><Layers size={16} /> Vista explodida</div>
            </div>
          </div>
        </section>

        <div className="strip">
          <div className="container strip-inner">
            <span><Ruler /> Medidas detalhadas</span>
            <span><Scissors /> Planos de corte</span>
            <span><Smartphone /> Celular ou impressão</span>
            <span><Download /> Acesso imediato</span>
          </div>
        </div>

        {/* DOR */}
        <section className="section dor">
          <div className="container">
            <Titulo eyebrow="VOCÊ CONHECE ESSA SITUAÇÃO?" desc="O problema quase nunca é falta de ideia. É falta de informação para executar.">
              Viu um projeto de madeira lindo, <mark>mas ninguém mostra as medidas?</mark>
            </Titulo>
            <div className="dor-grid">
              {dores.map((d) => (
                <article key={d.titulo} className="dor-card">
                  <XCircle className="dor-x" />
                  <h3>{d.titulo}</h3>
                  <p>{d.texto}</p>
                </article>
              ))}
            </div>
            <div className="virada">
              <div><span className="q">“</span>Vi essa peça na internet, mas não sei as medidas nem como construir.</div>
              <ArrowRight className="virada-seta" />
              <div className="virada-ok"><span className="q">“</span>Tenho um projeto organizado com medidas, materiais, cortes e montagem.</div>
            </div>
          </div>
        </section>

        {/* MÉTODO */}
        <section className="section metodo" id="metodo">
          <div className="container">
            <Titulo eyebrow="COMO FUNCIONA" desc="Toda ficha segue as mesmas três etapas. Você consulta tudo antes de pegar na madeira." light>
              Método M.C.M.: <mark>Medir, Cortar e Montar</mark>
            </Titulo>
            <div className="metodo-grid">
              {metodo.map((m, i) => (
                <article key={i} className="metodo-card">
                  <div className="metodo-top"><span className="metodo-letra">{m.letra}</span><span className="metodo-icon">{m.icon}</span></div>
                  <span className="metodo-passo">ETAPA {i + 1}</span>
                  <h3>{m.nome}</h3>
                  <ul>{m.itens.map((it) => <li key={it}><Check size={16} />{it}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FICHAS POR DENTRO */}
        <section className="section fichas" id="fichas">
          <div className="container">
            <Titulo eyebrow="VEJA POR DENTRO" desc="Cada projeto vem em uma ficha completa, pensada para você consultar na bancada.">
              É assim que são as <mark>fichas dos projetos</mark>
            </Titulo>
            <div className="fichas-layout">
              <div className="carrossel">
                <button className="seta seta-l" onClick={() => mover(-1)} aria-label="Projeto anterior"><ChevronLeft /></button>
                <figure className="carrossel-img">
                  <img src={fichas[slide].src} alt={`Ficha do projeto ${fichas[slide].nome}`} />
                  <figcaption><b>{fichas[slide].nome}</b><span>{fichas[slide].cat}</span></figcaption>
                </figure>
                <button className="seta seta-r" onClick={() => mover(1)} aria-label="Próximo projeto"><ChevronRight /></button>
                <div className="dots">
                  {fichas.map((f, i) => (
                    <button key={f.nome} className={i === slide ? "on" : ""} aria-label={`Ver ${f.nome}`} aria-current={i === slide} onClick={() => setSlide(i)} />
                  ))}
                </div>
              </div>
              <div className="anatomia">
                <h3>O que tem em cada ficha</h3>
                {anatomia.map((a) => (
                  <div className="anat-item" key={a.t}>
                    <span className="anat-icon">{a.icon}</span>
                    <div><b>{a.t}</b><p>{a.d}</p></div>
                  </div>
                ))}
                <Cta variant="outline" onClick={() => rolarPara("oferta")}>QUERO MEUS PROJETOS COM MEDIDAS</Cta>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA DE PROJETOS */}
        <section className="section galeria">
          <div className="container">
            <Titulo eyebrow="ALGUNS PROJETOS DA BIBLIOTECA" desc="Peças úteis e bonitas para a casa, do nível iniciante ao avançado. Todas com ficha completa.">
              O que você vai <mark>construir</mark>
            </Titulo>
            <div className="gal-grid">
              {projetosGaleria.map((p) => (
                <figure className="gal-item" key={p.n}>
                  <img src={p.src} alt={p.nome} loading="lazy" />
                  <figcaption><span className={`nv nv-${p.nivel === "Avançado" ? "A" : p.nivel === "Intermediário" ? "M" : "I"}`}>{p.nivel}</span><b>{p.nome}</b></figcaption>
                </figure>
              ))}
            </div>
            <p className="gal-mais">+ de 250 projetos na biblioteca completa</p>
          </div>
        </section>

        {/* CATEGORIAS */}
        <section className="section categorias">
          <div className="container">
            <Titulo eyebrow="TUDO ORGANIZADO" desc="Encontre o projeto pelo tipo de peça, pelo nível ou pelo cômodo da casa.">
              Mais de 250 projetos em <mark>7 categorias</mark>
            </Titulo>
            <div className="cat-grid">
              {categorias.map((c) => (
                <div className="cat-card" key={c.nome}>
                  <span className="cat-num">{c.qtd}</span>
                  <span className="cat-nome">{c.nome}</span>
                </div>
              ))}
              <div className="cat-card cat-natal">
                <span className="cat-num">+30</span>
                <span className="cat-nome">Projetos de Natal (bônus)</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÚBLICO E NÍVEIS */}
        <section className="section publico">
          <div className="container">
            <Titulo eyebrow="PARA QUEM É">Feito para quem quer <mark>tirar as ideias do papel</mark></Titulo>
            <div className="publico-grid">
              {publico.map((p) => <div className="publico-item" key={p}><Check size={18} /><span>{p}</span></div>)}
            </div>
            <div className="niveis">
              {niveis.map((n) => (
                <div className="nivel" key={n.n}>
                  <span className="nivel-n">{n.n}</span>
                  <div><h3>{n.t}</h3><p>{n.d}</p></div>
                </div>
              ))}
            </div>
            <p className="publico-nota">Você não precisa ter experiência profissional: comece pelos projetos de nível iniciante.</p>
          </div>
        </section>

        {/* BÔNUS */}
        <section className="section bonus" id="bonus">
          <div className="container">
            <Titulo eyebrow="PACOTE COMPLETO" desc="Materiais extras para planejar, executar e dar acabamento às suas peças.">
              E ainda leve <mark>5 bônus exclusivos</mark>
            </Titulo>
            <div className="bonus-grid">
              {bonus.map((b, i) => (
                <article className="bonus-card" key={b.titulo}>
                  <CapaBonus b={b} i={i} />
                  <div className="bonus-body"><h3>{b.titulo}</h3><p>{b.desc}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS (só aparece com depoimentos reais) */}
        {CONFIG.depoimentos.length > 0 && (
          <section className="section depo">
            <div className="container">
              <Titulo eyebrow="QUEM JÁ USA">O que dizem nossos <mark>clientes</mark></Titulo>
              <div className="depo-grid">
                {CONFIG.depoimentos.map((d) => (
                  <figure className="depo-card" key={d.nome}>
                    <div className="stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={16} fill="currentColor" />)}</div>
                    <blockquote>{d.texto}</blockquote>
                    <figcaption><b>{d.nome}</b> · {d.cidade}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* OFERTA */}
        <section className="section oferta" id="oferta">
          <div className="container">
            <Titulo eyebrow="ESCOLHA SEU ACESSO" desc="Pagamento único. Sem mensalidade. Acesso enviado por e-mail.">
              Comece hoje o seu <mark>próximo projeto de madeira</mark>
            </Titulo>
            <div className="planos">
              <article className="plano">
                <span className="plano-nome">ESSENCIAL</span>
                <h3>Biblioteca 250+ projetos</h3>
                <div className="preco"><small>R$</small>{CONFIG.precoEssencial}</div>
                <span className="preco-nota">pagamento único</span>
                <ul>{recebeEssencial.map((x) => <li key={x}><CheckCircle2 />{x}</li>)}</ul>
                <Cta variant="outline" id="cta-essencial" onClick={() => irParaCheckout(CONFIG.checkoutEssencial, "plano_essencial")}>QUERO O ESSENCIAL</Cta>
              </article>
              <article className="plano destaque">
                <span className="badge"><Star size={14} fill="currentColor" /> MAIS ESCOLHIDO</span>
                <span className="plano-nome">PACOTE COMPLETO</span>
                <h3>Biblioteca + 5 bônus</h3>
                <div className="preco"><small>R$</small>{CONFIG.precoCompleto}</div>
                <span className="preco-nota">pagamento único • só R$ 10 a mais pelos 5 bônus</span>
                <ul>{recebeCompleto.map((x, i) => <li key={x} className={i === 0 ? "" : "li-bonus"}>{i === 0 ? <CheckCircle2 /> : <Gift />}{x}</li>)}</ul>
                <Cta id="cta-completo" onClick={() => irParaCheckout(CONFIG.checkoutCompleto, "plano_completo")}>QUERO O PACOTE COMPLETO</Cta>
              </article>
            </div>
            <div className="selos">
              <span><LockKeyhole /> Pagamento seguro</span>
              <span><CreditCard /> Cartão ou Pix</span>
              <span><Download /> Produto digital</span>
              <span><Printer /> Pode imprimir</span>
            </div>
            <p className="aviso-digital">Produto 100% digital: você recebe o acesso por e-mail. Nenhum item físico é enviado.</p>
          </div>
        </section>

        {/* GARANTIA */}
        <section className="section garantia">
          <div className="container garantia-card">
            <div className="selo-garantia"><ShieldCheck size={56} /><b>{CONFIG.garantiaDias} DIAS</b><span>DE GARANTIA</span></div>
            <div>
              <span className="eyebrow">RISCO ZERO</span>
              <h2>Experimente por {CONFIG.garantiaDias} dias</h2>
              <p>Acesse a biblioteca, veja as fichas e escolha seu primeiro projeto. Se não ficar satisfeito dentro de {CONFIG.garantiaDias} dias, peça o reembolso pela plataforma de pagamento e devolvemos o valor pago.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq" id="faq">
          <div className="container faq-wrap">
            <Titulo eyebrow="DÚVIDAS">Perguntas <mark>frequentes</mark></Titulo>
            <div className="faq-list">
              {faqs.map(([q, a], i) => (
                <div key={q} className={`faq-item ${faqAberta === i ? "aberta" : ""}`}>
                  <button aria-expanded={faqAberta === i} onClick={() => setFaqAberta(faqAberta === i ? null : i)}>
                    <span>{q}</span><ChevronDown size={20} />
                  </button>
                  {faqAberta === i && <p>{a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="final">
          <div className="container final-inner">
            <h2>Da ideia à peça pronta, <em>com as medidas na mão</em></h2>
            <p>250+ projetos com medidas, planos de corte e montagem explicados.</p>
            <Cta onClick={() => rolarPara("oferta")}>QUERO ACESSAR OS 250+ PROJETOS</Cta>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand brand-foot"><span className="brand-mark"><Hammer size={18} /></span><span className="brand-text">MADEIRA <b>FÁCIL</b></span></div>
          <nav className="footer-links">
            {CONFIG.termosUrl && <a href={CONFIG.termosUrl}>Termos de uso</a>}
            {CONFIG.privacidadeUrl && <a href={CONFIG.privacidadeUrl}>Política de privacidade</a>}
            {CONFIG.emailContato && <a href={`mailto:${CONFIG.emailContato}`}>Contato</a>}
          </nav>
          <p className="disclaimer">Produto digital. Custos e tempos indicados nas fichas são estimativas e variam conforme materiais, ferramentas e experiência. Use equipamentos de proteção e siga as orientações de segurança das ferramentas. As imagens das peças são ilustrativas.</p>
          <p className="copy">© {new Date().getFullYear()} Madeira Fácil. Todos os direitos reservados.</p>
        </div>
      </footer>

      <div className={`sticky ${sticky ? "show" : ""}`}>
        <div><b>250+ Projetos de Madeira</b><small>a partir de R$ {CONFIG.precoEssencial}</small></div>
        <button className="checkout-btn" onClick={() => rolarPara("oferta")}>VER OFERTA <ArrowRight size={16} /></button>
      </div>

      {popup && (
        <div className="popup-bg" role="dialog" aria-modal="true" aria-labelledby="popup-title" onClick={() => setPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-x" aria-label="Fechar" onClick={() => setPopup(false)}><X /></button>
            <span className="eyebrow">ESPERA!</span>
            <h3 id="popup-title">Quer começar só com os projetos?</h3>
            <p>Leve a biblioteca com os 250+ projetos, medidas e planos de corte pelo plano Essencial.</p>
            <div className="popup-preco"><small>R$</small>{CONFIG.precoEssencial}</div>
            <Cta onClick={() => irParaCheckout(CONFIG.checkoutEssencial, "popup_saida")}>QUERO O ESSENCIAL</Cta>
            <button className="popup-nao" onClick={() => setPopup(false)}>Não, obrigado</button>
          </div>
        </div>
      )}
    </>
  );
}
