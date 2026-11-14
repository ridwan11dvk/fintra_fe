interface OrderedStage { id: string; roleGroup: string; sequence: number }

export function reorderStages<T extends OrderedStage>(items: T[], fromId: string, toId: string): T[] {
  const from = items.findIndex((item) => item.id === fromId);
  const to = items.findIndex((item) => item.id === toId);
  if (from < 0 || to < 0 || from === to || items[from].roleGroup !== items[to].roleGroup) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((stage, index) => ({ ...stage, sequence: index + 1 }));
}
