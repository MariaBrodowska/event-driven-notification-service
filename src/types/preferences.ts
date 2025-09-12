export interface EventSetting {
  enabled: boolean;
}

export interface DND {
  start: string;
  end: string;
}

export interface UserPreferences {
  dnd?: DND;
  eventSettings: Record<string, EventSetting>;
}
