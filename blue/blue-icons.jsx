// ============================================================
// blue-icons.jsx — inline SVG icons
// ============================================================
function Icon(props) {
  const size = props.size || 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={props.fill || "none"}
         stroke="currentColor" strokeWidth={props.stroke || 1.9} strokeLinecap="round"
         strokeLinejoin="round" className="icon">
      {props.path}
    </svg>
  );
}

const IconSearch   = (p) => <Icon {...p} path={<g><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></g>} />;
const IconSidebar  = (p) => <Icon {...p} path={<g><rect x="3" y="4" width="18" height="16" rx="2.5" /><line x1="9" y1="4" x2="9" y2="20" /></g>} />;
const IconNew      = (p) => <Icon {...p} path={<g><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></g>} />;
const IconChat     = (p) => <Icon {...p} path={<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />} />;
const IconProjects = (p) => <Icon {...p} path={<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />} />;
const IconSparkle  = (p) => <Icon {...p} fill="currentColor" stroke="none" path={<path d="M12 2l2.2 6.1L20 10l-5.8 1.9L12 18l-2.2-6.1L4 10l5.8-1.9L12 2z" />} />;
const IconPlus     = (p) => <Icon {...p} path={<g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>} />;
const IconArrowUp  = (p) => <Icon {...p} stroke={2.2} path={<g><line x1="12" y1="19" x2="12" y2="6" /><polyline points="6 11 12 5 18 11" /></g>} />;
const IconChevron  = (p) => <Icon {...p} path={<polyline points="6 9 12 15 18 9" />} />;
const IconTrash    = (p) => <Icon {...p} path={<g><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></g>} />;
const IconLogout   = (p) => <Icon {...p} path={<g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></g>} />;
const IconMenu     = (p) => <Icon {...p} path={<g><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></g>} />;

// action-chip icons
const IconWrite   = (p) => <Icon {...p} path={<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />} />;
const IconLearn   = (p) => <Icon {...p} path={<g><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></g>} />;
const IconPlan    = (p) => <Icon {...p} path={<g><circle cx="12" cy="12" r="9" /><polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9 16.2 7.8" /></g>} />;
const IconCode    = (p) => <Icon {...p} path={<g><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></g>} />;
const IconAnalyze = (p) => <Icon {...p} path={<g><line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="9" /><line x1="18" y1="20" x2="18" y2="4" /></g>} />;
