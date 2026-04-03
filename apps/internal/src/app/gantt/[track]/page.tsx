import GanttTrackClient from './client';

export function generateStaticParams() {
  return [{ track: 'siteandsaas' }];
}

export default function GanttTrackPage() {
  return <GanttTrackClient />;
}
