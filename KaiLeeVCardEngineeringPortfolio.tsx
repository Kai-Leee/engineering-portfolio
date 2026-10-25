import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './KaiLeeVCardEngineeringPortfolio.css';
import { koCopy, koProjects, type CopyKey } from './portfolio-ko';
type Tab = 'overview' | 'work' | 'experience' | 'background' | 'notes';
type Theme = 'amber' | 'ocean' | 'paper';
type Project = {
  id: keyof typeof koProjects;
  name: string;
  category: 'Agents' | 'Applied ML' | 'Software';
  label: string;
  title: string;
  summary: string;
  tags: string[];
  problem: string;
  decision: string;
  result: string;
  role: string;
  url: string;
  linkLabel: string;
};
const englishProjects: Project[] = [{
  id: 'loadout',
  name: 'Agent Loadout',
  category: 'Agents',
  label: 'Developer tooling · in progress',
  title: 'Making agent tools easier to bring to work.',
  summary: 'A shared home for Claude Code and Codex plugins, skills, hooks and MCP settings, with a staged move from Python and bash to Go.',
  tags: ['Developer tools', 'Go migration', 'Configuration'],
  problem: 'Useful agent tools still take work to discover, configure and keep consistent across environments. The management commands also had startup overhead.',
  decision: 'I chose a staged Go migration for speed and functionality, with existing OS tools used where appropriate and Windows treated as a separate target. Agents implemented and tested the changes.',
  result: 'The recorded first-stage benchmark for sync --check moved from a 1,904 ms median to 268 ms, with 8 runs per version in an isolated setup. This check path still called Python; it was not a complete migration or a cross-platform runtime result.',
  role: 'I set the migration direction and scope, then asked coding agents to implement and test the changes.',
  url: '',
  linkLabel: ''
}, {
  id: 'pointsman',
  name: 'Pointsman',
  category: 'Agents',
  label: 'Public project · ongoing research',
  title: 'Routing agent work with Jev and dependency DAGs.',
  summary: 'Jev turns a goal into tasks and dependencies; a DAG routes ready work to scoped coding agents and connects their outputs to checks.',
  tags: ['Jev', 'Dependency DAG', 'Task routing'],
  problem: 'A useful goal still leaves questions about task boundaries, dependencies and what counts as finished.',
  decision: 'Use Jev for decomposition and dependency planning, represent the work as a directed acyclic graph, and dispatch ready tasks through a queue. Give workers an explicit scope, then check and repair their outputs.',
  result: 'The public project and research records describe the workflow and its measured comparisons. Those comparisons apply to their recorded tasks and evaluation conditions.',
  role: 'I set the direction, asked questions about how the workflow should operate, and reviewed results. Coding agents helped implement and test the ideas.',
  url: 'https://github.com/Kai-Leee/pointsman',
  linkLabel: 'View repository'
}, {
  id: 'voice',
  name: 'Generated Audio Detection',
  category: 'Applied ML',
  label: 'Competition experiments',
  title: 'Finding the weak links in audio detection.',
  summary: 'Speech and music mixtures, representation choices, preprocessing and file-level aggregation.',
  tags: ['Audio ML', 'Data curation', 'Paired evaluation'],
  problem: 'An audio file can mix speech, music and generated segments. A promising model does not settle how to prepare, crop or aggregate that input.',
  decision: 'Compare stem-aware features, model representations and aggregation on matched inputs, and keep the question, configuration and result tied together.',
  result: 'One matched file-level panel improved while a music diagnostic worsened. I kept those findings separate rather than treating an internal result as a verified competition gain.',
  role: 'I directed data preparation and experimental choices, worked with coding agents on implementation, and reviewed the evidence behind score claims.',
  url: 'https://github.com/Kai-Leee/competition-portfolio/blob/main/competitions/deepvoice/README.md',
  linkLabel: 'Read case study'
}, {
  id: 'disclosure',
  name: 'Financial Disclosure Agent',
  category: 'Agents',
  label: 'Personal design & review notes',
  title: 'Making financial answers easier to check.',
  summary: 'A review of source-backed answers and the gap between a valid structure and a correct meaning.',
  tags: ['Evidence extraction', 'Semantic review', 'Human review'],
  problem: 'A well-formed response can still attach the wrong meaning to its evidence. Structure alone is an incomplete check.',
  decision: 'Treat source checking and semantic review as explicit steps. An agent review does not replace a person accepting the result.',
  result: 'The published case focuses on my design ideas and review lessons. It does not publish the team implementation or internal performance.',
  role: 'My contribution covered design ideas and review, with a focus on whether the evidence supported the answer.',
  url: 'https://github.com/Kai-Leee/competition-portfolio/blob/main/competitions/disclosure-agent/README.md',
  linkLabel: 'Read review notes'
}, {
  id: 'wind',
  name: 'BARAM Wind Power',
  category: 'Applied ML',
  label: 'Experiment retrospective',
  title: 'Working through a forecasting bottleneck.',
  summary: 'Forecasting experiments with shared evaluation contracts, scoped agent work and recorded failures.',
  tags: ['Forecasting', 'Experiment design', 'Learning from failure'],
  problem: 'The forecasting bottleneck persisted across a long series of ideas. More runs did not automatically produce a clearer explanation.',
  decision: 'Preserve hypotheses, configurations, ownership and verification. When progress stalled, I also sought out winning participants’ approaches to expand my understanding.',
  result: 'The record includes successful read-only verification stages and a separate failed implementation run. A final validated forecast score is not established by those checks.',
  role: 'I made experiment choices, reviewed agent work and sought external perspectives when my own approach stopped progressing.',
  url: 'https://github.com/Kai-Leee/competition-portfolio/blob/main/competitions/wind-power/README.md',
  linkLabel: 'Read retrospective'
}, {
  id: 'microstructure',
  name: 'Microstructure Hardness Prediction',
  category: 'Applied ML',
  label: 'Competition experiments',
  title: 'Learning what an image representation leaves out.',
  summary: 'Image models, manual masks and grain, pore and boundary features for hardness prediction from synthetic microstructure images.',
  tags: ['Image ML', 'Feature engineering', 'Error analysis'],
  problem: 'A grayscale image mixed noise, pores, grains and boundaries, while the target was a single hardness value. General image features did not give the result I expected.',
  decision: 'I spent time marking and masking images, then compared restored images, explicit structural features, tree models and CNNs. I also examined sensitivity to brightness.',
  result: 'Some early masking work helped in my experiments, but the later development OOF comparison did not support a benefit from the added features over the existing CNN. This was a development comparison, not an independent or official score.',
  role: 'I chose the image-analysis direction, worked on manual labels and masks, and reviewed agent-assisted experiments. Better separation of pores, grains and boundaries remains an open question.',
  url: 'https://github.com/Kai-Leee/competition-portfolio',
  linkLabel: 'View experiment archive'
}, {
  id: 'ibk',
  name: 'IBK Securities · Portfolio Optimization',
  category: 'Applied ML',
  label: 'Industry–academic project · Apr–Dec 2022',
  title: 'Connecting financial data to a usable service.',
  summary: 'Market prediction and portfolio optimization, with data collection, autoencoder-based dimensionality reduction and a deployed backend.',
  tags: ['Autoencoder', 'Django', 'MongoDB', 'Docker'],
  problem: 'A user-requested portfolio needed a path from financial data and analysis to an accessible service.',
  decision: 'I collected data, used an autoencoder to reduce its dimensions, and worked on portfolio optimization based on user requests. I connected Django APIs to MongoDB and prepared the Docker environment and server deployment.',
  result: 'The team delivered the service and final presentation. I contributed data processing, portfolio optimization and backend deployment.',
  role: 'As leader of a five-person industry–academic team working with IBK Securities, I coordinated the schedule and shared domain knowledge while handling data and backend work.',
  url: 'https://github.com/ibk-project/ibk-analytical-trading',
  linkLabel: 'View team repository'
}, {
  id: 'soynet',
  name: 'SoyNet · Model Conversion Parser',
  category: 'Software',
  label: 'Industry–academic project · Apr 2021–Feb 2022',
  title: 'Bridging model graphs and an inference engine.',
  summary: 'A C++ parser that maps ONNX graphs to SoyNet configuration and connects the PyTorch Mask R-CNN configuration path.',
  tags: ['C++', 'ONNX', 'Model integration'],
  problem: 'Model nodes and attributes needed to become parameters the inference engine could consume, without hiding conversion mistakes.',
  decision: 'I separated mapping rules into text tables and compared the converted configuration layer by layer. I connected postprocessing and input/output settings for the PyTorch Mask R-CNN path.',
  result: 'The work produced a configuration-generation path and corrected conversion errors through layer-level comparisons.',
  role: 'I developed the C++ conversion parser and mapping rules as part of the industry–academic project. This work predates my current agent-assisted workflow.',
  url: '',
  linkLabel: ''
}, {
  id: 'vessel',
  name: 'Multilingual Vessel Matching',
  category: 'Applied ML',
  label: 'Competition experiments',
  title: 'Separating missing candidates from wrong choices.',
  summary: 'Candidate search and BGE/LoRA reranking for multilingual vessel names, explored through parallel agent experiments.',
  tags: ['Entity matching', 'Reranking', 'Parallel experiments'],
  problem: 'A wrong match could come from the right vessel never entering the candidate pool, or from the model choosing the wrong candidate. Those failures needed different fixes.',
  decision: 'Compare search channels and rerankers on a shared candidate pool, keep missing-candidate errors separate, and review what information each method actually receives.',
  result: 'The development comparison showed a small difference between string-based search and BGE reranking. The development set was reused and the reranker received more information, so this did not isolate a model-only gain or establish an independent result.',
  role: 'I proposed ideas, designed comparisons and configured agents, skills and queues for parallel work. Coding agents implemented the candidates; I reviewed the comparisons and chose follow-up questions.',
  url: 'https://github.com/Kai-Leee/competition-portfolio',
  linkLabel: 'View experiment archive'
}];
const explorations: { name: string; summary: CopyKey; url?: string }[] = [
  { name: 'Personal OS', summary: 'A Markdown-first personal workspace with web and macOS views, backups and conflict checks. Native integration is still partial.' },
  { name: 'agent-workspace', summary: 'A LangGraph runner with checkpoints, review and human approval. Some provider integrations are exercised; the click-through demo remains separate from the runner.' },
  { name: 'Jcode / Desktop', summary: 'Local Rust changes around keyboard input, session forks, handoffs and project-path recovery. These are local modifications, without an upstream merge.' },
  { name: 'Jev PAPER / Roboadvisor', summary: 'Trading-service and Rust backtesting research in paper mode. The work has not established a stable profitability advantage.' },
  { name: 'Research Workbench', summary: 'A Python CLI and offline dashboard for CSV exploration and experiment records. Validation uses synthetic fixtures.' },
  { name: 'PPS Compliance Monitoring', summary: 'Rule and evidence-retrieval experiments with a mock submission flow. Model-level performance remains unmeasured.' },
  { name: 'SCPC', summary: 'Policy and event compilation, validation traces and submission records. Results belong to their specific recorded versions.' },
  { name: 'ETRI Sensor ML', summary: 'Sensor aggregation, tree-model experiments, OOF validation, calibration and fusion. Some historical artifacts remain incomplete.' },
  { name: 'UNCG Web Coursework', summary: 'A team web project using React, Express and PostgreSQL. This coursework is separate from my UNCG research internship.', url: 'https://github.com/Kai-Leee/CSC372_Final_Project' },
  { name: 'Payment Ledger', summary: 'A local ledger prototype separating transactions from interpretation, with refund, cancellation and transfer handling on synthetic data.' },
  { name: 'Todomate Static Analysis', summary: 'An artifact-inspection notebook covering binary resources and reference checks. It does not reconstruct the complete application source.' },
  { name: 'Skills / MCP Tooling', summary: 'Experiments connecting custom skills, search and reverse-engineering tools. Connection checks and individual tool validation are tracked separately.' },
  { name: 'DRAM Learning Site', summary: 'A learning interface and public-data loader scaffold. The planned analysis stages are still unfinished.' },
  { name: 'Growing Neural Graph', summary: 'Literature and design notes on integer, event-driven and growing neural graphs. No trained model or measured result yet.' },
  { name: 'Pleos Challenge', summary: 'Platform, SDK and competition-rule research. Preparation has not yet become an implemented application.' },
  { name: 'editor-lab / Base MVP', summary: 'Debugger integration checks and editor-routing architecture notes. This remains environment and design work.' },
  { name: 'FDE Learning Lab', summary: 'A mock integration exercise for state, cancellation, retries and confirmation. ASR, LLM and TTS are simulated; hands-on learning is still in progress.' }
];
const timeline: { date: CopyKey; kind: CopyKey; title: CopyKey; summary: CopyKey; projectIds?: Project['id'][] }[] = [
  { date: 'Oct 2026 · ongoing work', kind: 'Independent projects', title: 'Pointsman & Agent Loadout', summary: 'Jev + DAG task routing and shared agent-tool configuration. I set direction and review the work; coding agents help implement and test it.', projectIds: ['pointsman', 'loadout'] },
  { date: 'Oct 2026 · experiment records', kind: 'Applied ML experiments', title: 'Microstructure & vessel matching', summary: 'Image restoration and structural features; multilingual candidate retrieval and reranking. These dates identify the research records, not a confirmed project start.', projectIds: ['microstructure', 'vessel'] },
  { date: 'Aug–Sep 2026 · competition period', kind: 'Competition', title: 'Generated Audio Detection', summary: 'Speech/music data curation, model representations, cropping and file-level aggregation. Offline detection experiments.', projectIds: ['voice'] },
  { date: 'Aug 2026 · start recorded', kind: 'Team project', title: 'Financial Disclosure Agent', summary: 'Data extraction, retrieval and tool-calling work. Development was confirmed complete by September; the exact end date is not recorded. This site shares personal design and review notes.', projectIds: ['disclosure'] },
  { date: 'Jul–Aug 2026', kind: 'Competition', title: 'BARAM Wind Power', summary: 'Forecasting and experiment-management work, including hypothesis tracking, evaluation boundaries and learning from a persistent bottleneck.', projectIds: ['wind'] },
  { date: 'Jan–May 2026', kind: 'Exchange & research', title: 'UNCG · Lab Intern', summary: 'Approximately 3.5 months of fMRI graph-learning research within the exchange visit, including GAT-based DAGNN and Signed DAGNN exploration.' },
  { date: 'Jun 2024–Dec 2025', kind: 'Military service', title: 'Republic of Korea Army', summary: 'Satellite communications operator, sergeant and squad leader. Built an internal temperature-reporting system during service.' },
  { date: 'Aug 2023–May 2024', kind: 'Full-time', title: 'Timepercent · Backend & QA', summary: 'Stateful processing, shared business rules, trade-result monitoring, storage/query APIs and regression checks.' },
  { date: 'Mar–Jul 2023', kind: 'Internship', title: 'Timepercent · Backend & QA Intern', summary: 'Backtesting validation, a checking CLI, API documentation and router tests while learning the service and its expected behavior.' },
  { date: 'Jan–Dec 2023', kind: 'Community leadership', title: 'Uni-D · President', summary: 'Worked with representatives from participating universities on hackathon and datathon planning and operations.' },
  { date: 'Apr–Dec 2022', kind: 'Industry–academic project', title: 'IBK Securities · Team Lead', summary: 'Led a five-person project team; handled financial data, autoencoder-based dimensionality reduction, portfolio optimization and backend deployment.', projectIds: ['ibk'] },
  { date: 'Nov 2021–Nov 2022', kind: 'Student leadership', title: 'SKKU · Student Council President', summary: 'Rebuilt handover information for the return of offline events and used member and participant feedback to improve schedules and role allocation.' },
  { date: 'Apr 2021–Feb 2022', kind: 'Industry–academic project', title: 'SoyNet · C++ Model Parser', summary: 'Developed ONNX-to-SoyNet configuration mapping and the Mask R-CNN configuration-generation path, with layer-level comparisons.', projectIds: ['soynet'] }
];
const tabs: {
  id: Tab;
  label: CopyKey;
}[] = [{
  id: 'overview',
  label: 'Overview'
}, {
  id: 'work',
  label: 'Work'
}, {
  id: 'experience',
  label: 'Timeline'
}, {
  id: 'background',
  label: 'Background'
}, {
  id: 'notes',
  label: 'Notes'
}];
function Icon({
  kind = 'arrow',
  size = 18
}: {
  kind?: string;
  size?: number;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M5 13 13 5M5 5h8v8" /></>,
    github: <><path d="M9 17c-4 1-4-2-6-2m12 4v-3.5c0-1 .1-1.5-.5-2 3.4-.4 5.5-1.6 5.5-5.5 0-1.2-.4-2.2-1.1-3 .1-.5.5-1.7-.2-3-1 0-2.3.8-3 1.3a11 11 0 0 0-6 0C9 2.8 7.7 2 6.7 2 6 3.3 6.4 4.5 6.5 5 5.8 5.8 5.4 6.8 5.4 8c0 3.9 2.1 5.1 5.5 5.5-.5.4-.8 1-.8 2V19" /></>,
    layers: <><path d="m3 8 9-5 9 5-9 5-9-5Zm0 4 9 5 9-5M3 16l9 5 9-5" /></>,
    check: <><path d="m5 12 4 4L19 6" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></>,
    code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" /></>,
    close: <><path d="m5 5 14 14M19 5 5 19" /></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind] || paths.arrow}</svg>;
}
function External({
  href,
  children,
  className = ''
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<Icon /></a>;
}
function ProjectArt({
  id,
  t
}: {
  id: string;
  t: (text: CopyKey) => string;
}) {
  return <div className={`kp-art kp-art-${id}`}>
    <span className="kp-art-label">{t(id === 'loadout' ? 'TOOLS → CONFIG → ENVIRONMENT' : id === 'pointsman' ? 'JEV → DAG → WORKERS' : id === 'voice' ? 'SPEECH / MUSIC / SIGNAL' : id === 'wind' ? 'HYPOTHESIS → EXPERIMENT' : id === 'microstructure' ? 'IMAGE → FEATURES → EVALUATION' : id === 'ibk' ? 'DATA → ANALYSIS → SERVICE' : id === 'soynet' ? 'ONNX → MAPPING → CONFIG' : 'CLAIM → SOURCE → REVIEW')}</span>
    <svg viewBox="0 0 440 170" fill="none" aria-hidden="true">
      {['loadout', 'pointsman', 'soynet'].includes(id) ? <>
        <path d="M72 85h75m48-40h72m-72 80h72M171 65v-8c0-8 6-12 14-12m-14 60v8c0 8 6 12 14 12m128-80h45v80h-45" stroke="currentColor" strokeWidth="1.5" />
        <rect x="30" y="60" width="55" height="50" rx="10" /><rect x="146" y="60" width="50" height="50" rx="10" />
        <rect x="265" y="25" width="50" height="40" rx="8" /><rect x="265" y="105" width="50" height="40" rx="8" /><circle cx="358" cy="85" r="20" />
        <path d="m349 85 6 6 12-13" stroke="currentColor" strokeWidth="2" />
      </> : id === 'voice' ? <>
        <path d="M25 85h390M25 40h390M25 130h390" stroke="currentColor" opacity=".13" />
        {Array.from({
          length: 37
        }, (_, i) => {
          const h = 14 + (i * 29 + 17) % 81;
          return <path key={i} d={`M${37 + i * 10} ${85 - h / 2}v${h}`} stroke="currentColor" strokeWidth="3" opacity={i > 19 ? '.45' : '.9'} />;
        })}
      </> : id === 'wind' ? <>
        <path d="M125 83v65M125 77l-3-49c25 12 33 25 8 49m-10 5-39 29c-2-27 6-41 38-35m13 7 45 21c-23 14-40 13-49-15M295 70v78m0-84-3-40c21 10 28 21 7 40m-9 4-32 24c-2-23 5-35 31-29m11 5 37 18c-19 12-33 11-41-13" stroke="currentColor" strokeWidth="1.5" />
        <path d="M55 149h315m-10-35 15-9 15 9 15-9" stroke="currentColor" opacity=".4" />
      </> : <>
        <rect x="75" y="25" width="95" height="120" rx="8" /><path d="M95 51h49M95 69h57M95 87h35M95 105h49" stroke="currentColor" opacity=".6" />
        <path d="M170 85h75m70 0h44" stroke="currentColor" strokeDasharray="5 5" /><circle cx="280" cy="85" r="30" /><path d="m269 85 8 8 15-17" stroke="currentColor" strokeWidth="2" /><circle cx="370" cy="85" r="13" />
      </>}
    </svg><span className="kp-art-caption">{t('Concept illustration')}</span>
  </div>;
}
export const KaiLeeVCardEngineeringPortfolio = () => {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window === 'undefined') return 'overview';
    const section = new URLSearchParams(window.location.search).get('section');
    return section === 'timeline' ? 'experience' : tabs.find(tab => tab.id === section)?.id || 'overview';
  });
  const [theme, setTheme] = useState<Theme>('amber');
  const [language, setLanguage] = useState<'en' | 'ko'>(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('lang') === 'ko' ? 'ko' : 'en');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const t = (text: CopyKey): string => language === 'ko' ? koCopy[text] : text;
  const projects: Project[] = language === 'ko' ? englishProjects.map(project => ({
    ...project,
    ...koProjects[project.id]
  })) : englishProjects;
  const selected = projects.find(project => project.id === selectedId);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    document.title = 'Kai Lee | AI Systems Builder';
    document.documentElement.lang = language;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    if (activeTab === 'overview') url.searchParams.delete('section');
    else url.searchParams.set('section', activeTab === 'experience' ? 'timeline' : activeTab);
    window.history.replaceState(window.history.state, '', url);
  }, [language, activeTab]);
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
  }, [selectedId]);
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;else if (event.key === 'Home') next = 0;else if (event.key === 'End') next = tabs.length - 1;else return;
    event.preventDefault();
    setActiveTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  }
  function projectCard(project: Project, featured = false) {
    return <article className={`kp-project ${featured ? 'kp-featured' : ''}`} key={project.id}>
      <button type="button" className="kp-art-button" onClick={() => setSelectedId(project.id)} aria-label={language === 'ko' ? `${project.name} 상세 보기` : `Open ${project.name} case details`}><ProjectArt id={project.id} t={t} /></button>
      <div className="kp-project-copy"><div className="kp-project-meta"><span>{t(project.category)}</span><span>{project.label}</span></div>
        <button type="button" className="kp-project-title" onClick={() => setSelectedId(project.id)}>{project.name}<Icon /></button>
        <p>{project.summary}</p><div className="kp-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        {project.url && <External href={project.url} className="kp-source-link">{project.linkLabel}</External>}
      </div>
    </article>;
  }
  return <div className="kai-portfolio" data-theme={theme} lang={language}>
    <a className="kp-skip" href="#kp-main">{t('Skip to content')}</a>
    <div className="kp-topbar">
      <div className="kp-color-buttons" role="group" aria-label={t('COLOR THEME')}>{([{
        id: 'amber', label: 'Amber', mode: 'Dark'
      }, {
        id: 'ocean', label: 'Ocean', mode: 'Dark'
      }, {
        id: 'paper', label: 'Paper', mode: 'Light'
      }] as const).map(preset => <button type="button" className="kp-color-button" key={preset.id} aria-pressed={theme === preset.id} aria-label={language === 'ko' ? `${preset.label}, ${t(preset.mode)} 테마` : `${preset.label}, ${preset.mode} theme`} title={language === 'ko' ? `${preset.label}, ${t(preset.mode)} 테마` : `${preset.label}, ${preset.mode} theme`} onClick={() => setTheme(preset.id)}><span className={`kp-color-dot kp-swatch-${preset.id}`} aria-hidden="true" /></button>)}</div>
      <div className="kp-language-toggle" role="group" aria-label="Language / 언어"><button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button><button type="button" lang="ko" aria-pressed={language === 'ko'} onClick={() => setLanguage('ko')}>한국어</button></div>
    </div>
    <div className="kp-layout">
      <aside className="kp-sidebar" aria-label={t('Profile')}>
        <div className="kp-identity"><div className="kp-avatar" aria-hidden="true"><span>K</span><i /><b>LEE</b></div><div><h1>Kai Lee</h1><p className="kp-role">AI Systems Builder</p></div></div>
        <p className="kp-profile-intro">{t('I connect problems, agents and tools to build systems people can use. Always open to a conversation and a chance to build together.')}</p>
        <div className="kp-sidebar-rule" />
        <div className="kp-profile-lines"><div><span className="kp-icon-box"><Icon kind="code" /></span><p><small>{t('ENGINEERING')}</small>{t('Backend systems & QA')}</p></div><div><span className="kp-icon-box"><Icon kind="layers" /></span><p><small>{t('EXPLORATION')}</small>{t('Agents & applied ML')}</p></div><div><span className="kp-icon-box"><Icon kind="check" /></span><p><small>{t('WORKING STYLE')}</small>{t('AI-assisted. Human-reviewed.')}</p></div></div>
        <div className="kp-sidebar-links"><External href="https://github.com/Kai-Leee"><Icon kind="github" /> GitHub</External><a href="mailto:dlrlxor548@gmail.com">dlrlxor548@gmail.com<Icon /></a><a href="tel:+13362106832">+1 336-210-6832<Icon /></a><External href="https://www.linkedin.com/in/taeklee00/">LinkedIn</External></div>
        <p className="kp-sidebar-caption">{t('IDEAS → EXPERIMENTS → EVIDENCE')}</p>
      </aside>

      <main className="kp-main" id="kp-main">
        <nav className="kp-nav" role="tablist" aria-label={t('Portfolio sections')}>{tabs.map((tab, index) => <button type="button" role="tab" key={tab.id} id={`kp-tab-${tab.id}`} aria-controls={`kp-panel-${tab.id}`} aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1} ref={el => {
            tabRefs.current[index] = el;
          }} onKeyDown={event => moveTab(event, index)} onClick={() => setActiveTab(tab.id)}>{t(tab.label)}</button>)}</nav>

        <section className="kp-panel" role="tabpanel" id="kp-panel-overview" aria-labelledby="kp-tab-overview" hidden={activeTab !== 'overview'} tabIndex={0}>
          <div className="kp-section-heading"><span className="kp-eyebrow">{t("A LITTLE ABOUT ME")}</span><span className="kp-edition">{t("Portfolio / 2026")}</span></div>
          <div className="kp-hero"><h2>{t("From a question")}<br /><span>{t("to a system we can use.")}</span></h2><p>{t("My foundation is backend engineering and QA. Today I work with agents from problem definition through research, building and review. I am exploring how to connect the structure of the work with the tools and environments that make it happen—and how to make that easier for more people.")}</p><div className="kp-hero-actions"><button type="button" className="kp-primary" onClick={() => {
                setActiveTab('work');
                tabRefs.current[1]?.focus();
              }}>{t("Explore my work")} <Icon /></button><External href="https://github.com/Kai-Leee" className="kp-text-link">{t("View GitHub")}</External><button type="button" className="kp-text-link" onClick={() => {
                setActiveTab('notes');
                tabRefs.current[4]?.focus();
              }}>{t('Read my latest reflection')} <Icon /></button></div><div className="kp-brief-callout"><div><strong>{t('For FDE opportunities')}</strong><p>{t('My work, chronology and source links in one concise brief.')}</p></div><External href={`https://kai-leee.github.io/engineering-portfolio/fde-brief.html?lang=${language}`} className="kp-primary">{t('Open FDE brief')}</External></div></div>
          <div className="kp-about-grid"><section><h3>{t('What I bring')}</h3><p>{t('I ask questions until I understand the structure, turn assumptions into checks, and learn from the gap between expected and actual behavior.')}</p></section><section><h3>{t('What I am building')}</h3><p>{t('Agent workflows and developer tools that connect ideas, tasks, execution environments and human review.')}</p></section><section><h3>{t('What I care about')}</h3><p>{t('Useful tools that more people can try and shape together. I welcome conversations, feedback and opportunities to build with others.')}</p><a href="mailto:dlrlxor548@gmail.com" className="kp-text-link">{t('Say hello')} <Icon /></a></section></div>
          <div className="kp-at-a-glance" role="group" aria-label={t('Career at a glance')}>
            <button type="button" onClick={() => {
              setActiveTab('experience');
              tabRefs.current[2]?.focus();
            }}><span>{t("PROFESSIONAL")}</span><strong>Timepercent</strong><small>{t("Backend & QA · 2023–2024")}</small><Icon /></button>
            <button type="button" onClick={() => {
              setActiveTab('background');
              tabRefs.current[3]?.focus();
            }}><span>{t("EDUCATION")}</span><strong>{t("Sungkyunkwan University")}</strong><small>{t("Software · Expected Feb 2027")}</small><Icon /></button>
            <button type="button" onClick={() => {
              setActiveTab('background');
              tabRefs.current[3]?.focus();
            }}><span>{t("SERVICE & LEADERSHIP")}</span><strong>{t("Republic of Korea Army")}</strong><small>{t("Satellite communications · 2024–2025")}</small><Icon /></button>
          </div>
          <div className="kp-section-title"><h3>{t("Selected work")}<span className="kp-dot">.</span></h3><button type="button" className="kp-text-link" onClick={() => {
              setActiveTab('work');
              tabRefs.current[1]?.focus();
            }}>{t("All projects")} <Icon /></button></div>
          <div className="kp-selected-grid">{projects.slice(0, 2).map(project => projectCard(project, true))}</div>
          <div className="kp-working-note"><div><h3>{t('Own my part.')}<br />{t('Help the team finish together.')}</h3><p>{t('I find purpose in taking responsibility for a shared goal and bringing it into reality. I work with agents to build, while staying accountable for the questions, the checks and what I accept.')}</p><button type="button" className="kp-text-link" onClick={() => { setActiveTab('notes'); tabRefs.current[4]?.focus(); }}>{t('Read about responsibility & leadership')} <Icon /></button></div></div>
        </section>

        <section className="kp-panel" role="tabpanel" id="kp-panel-work" aria-labelledby="kp-tab-work" hidden={activeTab !== 'work'} tabIndex={0}>
          <span className="kp-eyebrow">{t("SELECTED PROJECTS & EXPERIMENTS")}</span><h2 className="kp-page-title">{t("Work")}<span className="kp-dot">.</span></h2><p className="kp-page-intro">{t("The problem, the decisions and the evidence behind the work. Open a project for my role and what I learned.")}</p>
          <div className="kp-filters" role="group" aria-label={t('Filter projects')}>{(['All', 'Agents', 'Applied ML', 'Software'] as const).map(item => <button type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{t(item)}</button>)}</div>
          <div className="kp-work-grid" aria-live="polite">{projects.filter(project => filter === 'All' || project.category === filter).map(project => projectCard(project))}</div>
          <details className="kp-exploration-archive"><summary>{t('More from my workbench')}</summary><p className="kp-page-intro">{t('A wider notebook of prototypes, local changes, coursework and research. These are at different stages; they are not all released products.')}</p><div className="kp-explorations">{explorations.map(item => <article key={item.name}><h3>{item.url ? <External href={item.url}>{item.name}</External> : item.name}</h3><p>{t(item.summary)}</p></article>)}</div></details>
        </section>

        <section className="kp-panel" role="tabpanel" id="kp-panel-experience" aria-labelledby="kp-tab-experience" hidden={activeTab !== 'experience'} tabIndex={0}>
          <span className="kp-eyebrow">{t('MY WORK OVER TIME')}</span><h2 className="kp-page-title">{t('Timeline')}<span className="kp-dot">.</span></h2><p className="kp-page-intro">{t('A chronological view of employment, projects, research, service and leadership. Overlapping activities keep their own dates and roles.')}</p>
          <div className="kp-timeline-education"><span>{t('Education')}</span><strong>{t('Sungkyunkwan University')}</strong><p>{t('Software · Mar 2020–expected Feb 2027')}</p></div>
          <ol className="kp-timeline">{timeline.map(entry => <li key={entry.title}><div className="kp-timeline-date">{t(entry.date)}<span>{t(entry.kind)}</span></div><article><h3>{t(entry.title)}</h3><p>{t(entry.summary)}</p>{entry.projectIds && <div className="kp-timeline-links">{entry.projectIds.map(id => <button key={id} type="button" className="kp-text-link" onClick={() => setSelectedId(id)}>{projects.find(project => project.id === id)!.name} <Icon /></button>)}</div>}</article></li>)}</ol>
          <p className="kp-scope-note">{t('Dates marked as records or competition periods do not establish a personal project start or full participation period.')}</p>
          <div className="kp-section-title"><h3>{t('Experience in detail')}<span className="kp-dot">.</span></h3></div>
          <div className="kp-experience"><div className="kp-experience-mark"><Icon kind="code" size={22} /></div><article><p className="kp-eyebrow">{t("PROFESSIONAL EXPERIENCE")}</p><h3>{t("Backend Engineering & QA")}</h3><p className="kp-company">Timepercent</p><p className="kp-dates">{t("Intern · Mar–Jul 2023")}<br />{t("Full-time · Aug 2023–May 2024")}</p><p>{t("I worked on service verification and backend flows that preserve state across processing segments, with results that can be recorded, compared and inspected.")}</p><ul><li>{t("Separated processing boundaries from the lifetime of business state.")}</li><li>{t("Worked on monitoring-result storage, retrieval and error records.")}</li><li>{t("Asked colleagues about expected behavior and used the differences I found to guide verification and fixes.")}</li></ul><div className="kp-tags"><span>Python</span><span>{t("State transitions")}</span><span>QA</span><span>{t("Monitoring")}</span></div><p className="kp-scope-note">{t("Public summary of my responsibilities. Company code, data and internal policies are not included.")}</p></article></div>
          <div className="kp-experience"><div className="kp-experience-mark"><Icon kind="layers" size={22} /></div><article><p className="kp-eyebrow">{t("INDEPENDENT PROJECTS")}</p><h3>{t("AI-assisted Engineering & Applied ML")}</h3><p>{t("I work from an idea to a testable question, then use agents to help research, implement and compare possible answers.")}</p><ul><li>{t("Define execution scope and the artifacts a task should produce.")}</li><li>{t("Inspect data preparation, labels and evaluation conditions before interpreting a score.")}</li><li>{t("Keep human review at the point where a proposed result becomes an accepted conclusion.")}</li></ul><External href="https://github.com/Kai-Leee/competition-portfolio/blob/main/workflow/agent-native-development.md" className="kp-source-link">{t("Read my workflow")}</External></article></div>
        </section>

        <section className="kp-panel" role="tabpanel" id="kp-panel-background" aria-labelledby="kp-tab-background" hidden={activeTab !== 'background'} tabIndex={0}>
          <span className="kp-eyebrow">{t("EDUCATION, SERVICE & LEADERSHIP")}</span><h2 className="kp-page-title">{t("Background")}<span className="kp-dot">.</span></h2><p className="kp-page-intro">{t("The studies, service and community roles behind my engineering work.")}</p>
          <div className="kp-background-list">
            <article className="kp-background-entry"><div className="kp-background-meta"><span>{t("01 / EDUCATION")}</span><p>{t("Mar 2020–Feb 2027")}<br /><small>{t("Expected graduation")}</small></p></div><div><h3>{t("Sungkyunkwan University")}</h3><p className="kp-company">{t("Department of Software")}</p><p>{t("Studying software engineering, with project work across backend development, applied machine learning and AI systems.")}</p><div className="kp-tags"><span>{t("Software")}</span><span>{t("Expected Feb 2027")}</span></div></div></article>
            <article className="kp-background-entry"><div className="kp-background-meta"><span>{t("02 / RESEARCH")}</span><p>{t("Jan–May 2026")}<br /><small>{t("Exchange visit")}</small></p></div><div><h3>{t("University of North Carolina at Greensboro")}</h3><p className="kp-company">{t("Exchange Student & Lab Intern")}</p><p>{t("Worked with Prof. Minjeong Kim on early Alzheimer’s classification using ADNI fMRI data. Converted functional connectivity into graphs and explored GAT-based DAGNN and a Signed DAGNN design that separates positive and negative connections.")}</p><p className="kp-scope-note">{t("The research internship lasted approximately 3.5 months within the exchange visit.")}</p><div className="kp-tags"><span>{t("Graph learning")}</span><span>fMRI</span><span>{t("Research")}</span></div></div></article>
            <article className="kp-background-entry"><div className="kp-background-meta"><span>{t("03 / MILITARY SERVICE")}</span><p>{t("Jun 2024–Dec 2025")}<br /><small>{t("Completed service")}</small></p></div><div><h3>{t("Republic of Korea Army")}</h3><p className="kp-company">{t("Fixed Satellite Communications Operator · Sergeant")}</p><p>{t("Completed military service and was appointed as a squad leader. During service, I built an internal temperature-reporting automation system.")}</p><p className="kp-scope-note">{t("This summary covers my role and project at a high level.")}</p><div className="kp-tags"><span>{t("Satellite communications")}</span><span>{t("Squad leadership")}</span><span>{t("Automation")}</span></div></div></article>
            <article className="kp-background-entry"><div className="kp-background-meta"><span>{t("04 / COMMUNITY")}</span><p>2021–2023<br /><small>{t("Two separate roles")}</small></p></div><div><h3>{t("Student & Developer Communities")}</h3><div className="kp-community-role"><h4>{t("President · College of Software Student Council")}</h4><p>{t("Sungkyunkwan University · Nov 2021–Nov 2022")}</p></div><div className="kp-community-role"><h4>{t("President · Uni-D")}</h4><p>{t("Inter-university IT, software, hackathon and datathon community · Jan–Dec 2023")}</p></div><div className="kp-tags"><span>{t("Community leadership")}</span><span>{t("Student representation")}</span></div></div></article>
          </div>
        </section>

        <section className="kp-panel" role="tabpanel" id="kp-panel-notes" aria-labelledby="kp-tab-notes" hidden={activeTab !== 'notes'} tabIndex={0}>
          <span className="kp-eyebrow">{t("LESSONS FROM THE WORK")}</span><h2 className="kp-page-title">{t("Notes")}<span className="kp-dot">.</span></h2><p className="kp-page-intro">{t("What I changed my mind about, what failed and what I would check earlier next time.")}</p>
          <article className="kp-reflection" aria-labelledby="kp-responsibility-title">
            <div className="kp-reflection-meta"><span className="kp-eyebrow">{t('RESPONSIBILITY & LEADERSHIP')}</span><time dateTime="2026-10-25">{t('25 October 2026')}</time></div>
            <h3 id="kp-responsibility-title">{t('Own my part. Help the team finish together.')}</h3>
            <p className="kp-reflection-intro">{t('Whatever my title, I want to take responsibility for my work and help the team reach a better result. Seeing a shared goal become real is a source of joy for me.')}</p>
            <div className="kp-reflection-grid">
              <section><h4>{t('Responsibility gives the work meaning.')}</h4><p>{t('When I accept responsibility, I want to see it through. Difficult stretches can be tiring, but making the result we imagined is rewarding. I want to bring that commitment to the teams I join.')}</p></section>
              <section><h4>{t('Followership starts with ownership.')}</h4><p>{t('I see good followers as leaders within their own roles. They take initiative in their area and work to understand the decisions and constraints of the people around them.')}</p></section>
              <section><h4>{t('Leadership includes the other person’s view.')}</h4><p>{t('Student council, the IBK project and Uni-D shaped my view of leadership. A leader needs to understand how others can contribute and share responsibility for the team’s result.')}</p></section>
              <section><h4>{t('The work I want to own as an FDE.')}</h4><p>{t('I want to understand a team’s work and policies, agree on success with the people involved, and connect systems until the intended workflow works in practice. I also want what we learn to make the next deployment better.')}</p></section>
            </div>
            <p className="kp-reflection-source">{t('Adapted from my additional reflection on 25 October 2026. This describes my values and the work I want to do.')}</p>
          </article>
          <article className="kp-reflection" aria-labelledby="kp-reflection-title">
            <div className="kp-reflection-meta"><span className="kp-eyebrow">{t('PERSONAL REFLECTION')}</span><time dateTime="2026-10-25">{t('25 October 2026')}</time></div>
            <h3 id="kp-reflection-title">{t('From trying AI tools to making them work together.')}</h3>
            <p className="kp-reflection-intro">{t('Why I build, how I learn and the questions I want to work on next.')}</p>
            <div className="kp-reflection-grid">
              <section><h4>{t('Building is how I learn.')}</h4><p>{t('Competitions are a way for me to learn by building. I want to see what AI can actually do and how other people use it. Participating, trying ideas and making something are part of how I study.')}</p></section>
              <section><h4>{t('Connecting tools is the question.')}</h4><p>{t('My interest is shifting from using a single model to connecting models, tools and agents. Pointsman is part of that exploration. I am also interested in reducing the setup and connection work that makes useful plugins hard to bring into everyday tasks.')}</p></section>
              <section><h4>{t('Questions before confidence.')}</h4><p>{t('I start by asking why a system behaves the way it does and why another approach would not work. That can make the beginning slow. Once I understand the structure, I feel more confident about moving forward. I still need to turn that confidence into evidence that other people can inspect.')}</p></section>
              <section><h4>{t('Turning exploration into depth.')}</h4><p>{t('I want to connect this exploration to real industry problems and learn how AI is used in practice. My open question is how to balance trying new tools with building depth in a field. I am looking for a team where I can keep building, questioning and learning.')}</p></section>
            </div>
            <p className="kp-reflection-source">{t('Adapted from my personal reflection, written on 25 October 2026.')}</p>
          </article>
          <h3 className="kp-lessons-heading">{t('Lessons from my projects')}</h3>
          <div className="kp-notes-list">{[{
              number: '01',
              topic: t('AGENT ENGINEERING'),
              title: t('A valid response can still be wrong.'),
              text: t('Why source checking and semantic review need their own place in an agent workflow.'),
              url: projects.find(project => project.id === 'disclosure')!.url
            }, {
              number: '02',
              topic: t('EXPERIMENT DESIGN'),
              title: t('An improvement needs a boundary.'),
              text: t('A better file-level result and a worse music diagnostic can both be true. Matching inputs matters.'),
              url: projects.find(project => project.id === 'voice')!.url
            }, {
              number: '03',
              topic: t('WORKING WITH AI'),
              title: t('Make the work inspectable.'),
              text: t('Task contracts, scoped artifacts and checks that point to the actual result.'),
              url: projects.find(project => project.id === 'pointsman')!.url
            }].map(note => <article className="kp-note-row" key={note.number}><span className="kp-note-number">{note.number}</span><div><p className="kp-eyebrow">{note.topic}</p><h3><a href={note.url} target="_blank" rel="noopener noreferrer">{note.title}<Icon /></a></h3><p>{note.text}</p></div></article>)}</div>
          <External href="https://github.com/Kai-Leee/competition-portfolio" className="kp-primary">{t("Browse the case-study archive")} <Icon kind="github" /></External>
        </section>

        <footer className="kp-footer"><span>{t("Kai Lee · Engineering portfolio")}</span><span>{t("Built in MagicPath ·")} <a href="https://github.com/codewithsadee/vcard-personal-portfolio" target="_blank" rel="noopener noreferrer">{t("Inspired by vCard")}</a></span></footer>
      </main>
    </div>

    <dialog ref={dialog} className="kp-dialog" aria-labelledby="kp-detail-title" onClose={() => setSelectedId(null)} onClick={event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      {selected && <div className="kp-dialog-content"><button type="button" className="kp-dialog-close" aria-label={t("Close project details")} onClick={() => dialog.current?.close()}><Icon kind="close" size={22} /></button><p className="kp-eyebrow">{selected.name} / {t(selected.category)}</p><h2 id="kp-detail-title">{selected.title}</h2><p className="kp-dialog-label">{selected.label}</p><div className="kp-detail-section"><h3>{t("The problem")}</h3><p>{selected.problem}</p></div><div className="kp-detail-section"><h3>{t("My decision")}</h3><p>{selected.decision}</p></div><div className="kp-detail-section"><h3>{t("What the evidence says")}</h3><p>{selected.result}</p></div><div className="kp-detail-section"><h3>{t("My role")}</h3><p>{selected.role}</p></div>{selected.url && <External href={selected.url} className="kp-primary">{selected.linkLabel}</External>}</div>}
    </dialog>
  </div>;
};
