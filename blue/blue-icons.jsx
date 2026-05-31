// ============================================================
// blue-icons.jsx — inline SVG icons
// ============================================================
function Icon(props) {
  const size = props.size || 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={props.fill || "none"}
         stroke="currentColor" strokeWidth={props.stroke || 2} strokeLinecap="round"
         strokeLinejoin="round" className="icon">
      {props.path}
    </svg>
  );
}

const IconSend    = (p) => <Icon {...p} path={<g><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></g>} />;
const IconPlus    = (p) => <Icon {...p} path={<g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>} />;
const IconTrash   = (p) => <Icon {...p} path={<g><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></g>} />;
const IconLogout  = (p) => <Icon {...p} path={<g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></g>} />;
const IconAttach  = (p) => <Icon {...p} path={<path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" />} />;
const IconChevron = (p) => <Icon {...p} path={<polyline points="6 9 12 15 18 9" />} />;
const IconSpark   = (p) => <Icon {...p} fill="currentColor" stroke="none" path={<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />} />;
