import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './KaiLeeVCardEngineeringPortfolio.css';
import { koCopy, koProjects, type CopyKey } from './portfolio-ko';
type Tab = 'overview' | 'work' | 'experience' | 'background' | 'notes';
type Theme = 'amber' | 'ocean' | 'paper';
type Project = {
  id: keyof typeof koProjects;
  name: string;
  category: 'Agents' | 'Applied ML';
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
  id: 'pointsman',
  name: 'Pointsman',
  category: 'Agents',
  label: 'Public project · ongoing research',
  title: 'Giving agent work a clearer contract.',
  summary: 'Task routing for coding agents, with explicit scopes, artifact contracts and recorded checks.',
  tags: ['Agent workflows', 'Task routing', 'Verification'],
  problem: 'A useful goal still leaves questions about task boundaries, dependencies and what counts as finished.',
  decision: 'Make the decisions inspectable: define the work, scope each worker and connect checks to the artifacts they evaluate.',
  result: 'The public project and research records describe the workflow and its measured comparisons. Those comparisons apply to their recorded tasks and evaluation conditions.',
  role: 'I set the direction, questioned the workflow and reviewed results. Coding agents helped implement and test the ideas.',
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
  role: 'I directed data preparation and experimental choices, used coding agents for implementation, and reviewed the evidence behind score claims.',
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
  role: 'This public account covers my personal design and review scope, with the team’s implementation kept outside the published material.',
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
}];
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
  label: 'Experience'
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
    <span className="kp-art-label">{t(id === 'pointsman' ? 'TASK → CONTRACT → CHECK' : id === 'voice' ? 'SPEECH / MUSIC / SIGNAL' : id === 'wind' ? 'HYPOTHESIS → EXPERIMENT' : 'CLAIM → SOURCE → REVIEW')}</span>
    <svg viewBox="0 0 440 170" fill="none" aria-hidden="true">
      {id === 'pointsman' ? <>
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
  const [activeTab, setActiveTab] = useState<Tab>('overview');
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
    document.title = language === 'ko' ? 'Kai Lee | 백엔드 · AI 시스템' : 'Kai Lee | Backend & AI Systems';
    document.documentElement.lang = language;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState(window.history.state, '', url);
  }, [language]);
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
        <External href={project.url} className="kp-source-link">{project.linkLabel}</External>
      </div>
    </article>;
  }
  return <div className="kai-portfolio" data-theme={theme} lang={language}>
    <a className="kp-skip" href="#kp-main">{t('Skip to content')}</a>
    <div className="kp-layout">
      <aside className="kp-sidebar" aria-label={t('Profile')}>
        <div className="kp-identity"><div className="kp-avatar" aria-hidden="true"><span>K</span><i /><b>LEE</b></div><div><h1>Kai Lee</h1><p className="kp-role">{t('Backend & AI Systems')}</p></div></div>
        <p className="kp-profile-intro">{t('A software engineer who likes to understand the problem, build with AI, and check what actually changed.')}</p>
        <div className="kp-sidebar-rule" />
        <div className="kp-profile-lines"><div><span className="kp-icon-box"><Icon kind="code" /></span><p><small>{t('ENGINEERING')}</small>{t('Backend systems & QA')}</p></div><div><span className="kp-icon-box"><Icon kind="layers" /></span><p><small>{t('EXPLORATION')}</small>{t('Agents & applied ML')}</p></div><div><span className="kp-icon-box"><Icon kind="check" /></span><p><small>{t('WORKING STYLE')}</small>{t('AI-assisted. Human-reviewed.')}</p></div></div>
        <div className="kp-sidebar-links"><External href="https://github.com/Kai-Leee"><Icon kind="github" /> GitHub</External><External href="https://github.com/Kai-Leee/competition-portfolio">{t('Case studies')}</External></div>
        <div className="kp-language-picker" role="group" aria-label="Language / 언어"><button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button><button type="button" lang="ko" aria-pressed={language === 'ko'} onClick={() => setLanguage('ko')}>한국어</button></div>
        <fieldset className="kp-theme-picker"><legend>{t('COLOR THEME')}</legend><div>{([{
              id: 'amber',
              label: 'Amber',
              mode: 'Dark'
            }, {
              id: 'ocean',
              label: 'Ocean',
              mode: 'Dark'
            }, {
              id: 'paper',
              label: 'Paper',
              mode: 'Light'
            }] as const).map(preset => <button type="button" key={preset.id} aria-pressed={theme === preset.id} aria-label={language === 'ko' ? `${preset.label}, ${t(preset.mode)} 테마` : `${preset.label}, ${preset.mode} theme`} onClick={() => setTheme(preset.id)}><span className={`kp-theme-swatch kp-swatch-${preset.id}`} aria-hidden="true" /><span>{preset.label}<small>{t(preset.mode)}</small></span></button>)}</div></fieldset>
        <p className="kp-sidebar-caption">{t('IDEAS → EXPERIMENTS → EVIDENCE')}</p>
      </aside>

      <main className="kp-main" id="kp-main">
        <nav className="kp-nav" role="tablist" aria-label={t('Portfolio sections')}>{tabs.map((tab, index) => <button type="button" role="tab" key={tab.id} id={`kp-tab-${tab.id}`} aria-controls={`kp-panel-${tab.id}`} aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1} ref={el => {
            tabRefs.current[index] = el;
          }} onKeyDown={event => moveTab(event, index)} onClick={() => setActiveTab(tab.id)}>{t(tab.label)}</button>)}</nav>

        <section className="kp-panel" role="tabpanel" id="kp-panel-overview" aria-labelledby="kp-tab-overview" hidden={activeTab !== 'overview'} tabIndex={0}>
          <div className="kp-section-heading"><span className="kp-eyebrow">{t("A LITTLE ABOUT ME")}</span><span className="kp-edition">{t("Portfolio / 2026")}</span></div>
          <div className="kp-hero"><h2>{t("I build systems,")}<br /><span>{t("then test the assumptions.")}</span></h2><p>{t("My work spans backend engineering, QA and AI competitions. I enter competitions to see how AI performs in practice and learn from other builders. Today I am exploring how models, tools and agents can work together, and how to make that setup easier to use. I want to connect that learning to real industry problems.")}</p><div className="kp-hero-actions"><button type="button" className="kp-primary" onClick={() => {
                setActiveTab('work');
                tabRefs.current[1]?.focus();
              }}>{t("Explore my work")} <Icon /></button><External href="https://github.com/Kai-Leee" className="kp-text-link">{t("View GitHub")}</External><button type="button" className="kp-text-link" onClick={() => {
                setActiveTab('notes');
                tabRefs.current[4]?.focus();
              }}>{t('Read my latest reflection')} <Icon /></button></div></div>
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
          <div className="kp-working-note"><span className="kp-note-symbol" aria-hidden="true">↳</span><div><h3>{t("AI is part of the workflow.")}<br />{t("Judgment is my responsibility.")}</h3><p>{t("I make the question explicit, compare the results and decide what to accept. Failed experiments and unresolved limits stay in the record.")}</p></div></div>
        </section>

        <section className="kp-panel" role="tabpanel" id="kp-panel-work" aria-labelledby="kp-tab-work" hidden={activeTab !== 'work'} tabIndex={0}>
          <span className="kp-eyebrow">{t("SELECTED PROJECTS & EXPERIMENTS")}</span><h2 className="kp-page-title">{t("Work")}<span className="kp-dot">.</span></h2><p className="kp-page-intro">{t("The problem, the decisions and the evidence behind the work. Open a project for my role and what I learned.")}</p>
          <div className="kp-filters" role="group" aria-label={t('Filter projects')}>{(['All', 'Agents', 'Applied ML'] as const).map(item => <button type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{t(item)}</button>)}</div>
          <div className="kp-work-grid" aria-live="polite">{projects.filter(project => filter === 'All' || project.category === filter).map(project => projectCard(project))}</div>
        </section>

        <section className="kp-panel" role="tabpanel" id="kp-panel-experience" aria-labelledby="kp-tab-experience" hidden={activeTab !== 'experience'} tabIndex={0}>
          <span className="kp-eyebrow">{t("PROFESSIONAL & INDEPENDENT WORK")}</span><h2 className="kp-page-title">{t("Experience")}<span className="kp-dot">.</span></h2><p className="kp-page-intro">{t("A background in service behavior, stateful systems and testing, extended through agent and machine-learning projects.")}</p>
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
              url: projects[2].url
            }, {
              number: '02',
              topic: t('EXPERIMENT DESIGN'),
              title: t('An improvement needs a boundary.'),
              text: t('A better file-level result and a worse music diagnostic can both be true. Matching inputs matters.'),
              url: projects[1].url
            }, {
              number: '03',
              topic: t('WORKING WITH AI'),
              title: t('Make the work inspectable.'),
              text: t('Task contracts, scoped artifacts and checks that point to the actual result.'),
              url: projects[0].url
            }].map(note => <article className="kp-note-row" key={note.number}><span className="kp-note-number">{note.number}</span><div><p className="kp-eyebrow">{note.topic}</p><h3><a href={note.url} target="_blank" rel="noopener noreferrer">{note.title}<Icon /></a></h3><p>{note.text}</p></div></article>)}</div>
          <External href="https://github.com/Kai-Leee/competition-portfolio" className="kp-primary">{t("Browse the case-study archive")} <Icon kind="github" /></External>
        </section>

        <footer className="kp-footer"><span>{t("Kai Lee · Engineering portfolio")}</span><span>{t("Built in MagicPath ·")} <a href="https://github.com/codewithsadee/vcard-personal-portfolio" target="_blank" rel="noopener noreferrer">{t("Inspired by vCard")}</a></span></footer>
      </main>
    </div>

    <dialog ref={dialog} className="kp-dialog" aria-labelledby="kp-detail-title" onClose={() => setSelectedId(null)} onClick={event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      {selected && <div className="kp-dialog-content"><button type="button" className="kp-dialog-close" aria-label={t("Close project details")} onClick={() => dialog.current?.close()}><Icon kind="close" size={22} /></button><p className="kp-eyebrow">{selected.name} / {t(selected.category)}</p><h2 id="kp-detail-title">{selected.title}</h2><p className="kp-dialog-label">{selected.label}</p><div className="kp-detail-section"><h3>{t("The problem")}</h3><p>{selected.problem}</p></div><div className="kp-detail-section"><h3>{t("My decision")}</h3><p>{selected.decision}</p></div><div className="kp-detail-section"><h3>{t("What the evidence says")}</h3><p>{selected.result}</p></div><div className="kp-detail-section"><h3>{t("My role & AI assistance")}</h3><p>{selected.role}</p></div><External href={selected.url} className="kp-primary">{selected.linkLabel}</External></div>}
    </dialog>
  </div>;
};
