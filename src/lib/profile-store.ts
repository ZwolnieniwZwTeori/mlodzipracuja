"use client";

import type { CandidateProfile, EmployerProfile } from "@/lib/profile-schema";

const CANDIDATE_KEY = "pracamlodych-profile";
const EMPLOYER_KEY = "pracamlodych-employer";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Tryb prywatny / pełny storage — profil po prostu nie przetrwa
  }
}

export function loadCandidate(): CandidateProfile | null {
  return read<CandidateProfile>(CANDIDATE_KEY);
}

export function saveCandidate(profile: CandidateProfile) {
  write(CANDIDATE_KEY, profile);
}

export function clearCandidate() {
  try {
    localStorage.removeItem(CANDIDATE_KEY);
  } catch {
    // ignore
  }
}

export function loadEmployer(): EmployerProfile | null {
  return read<EmployerProfile>(EMPLOYER_KEY);
}

export function saveEmployer(profile: EmployerProfile) {
  write(EMPLOYER_KEY, profile);
}

export function clearEmployer() {
  try {
    localStorage.removeItem(EMPLOYER_KEY);
  } catch {
    // ignore
  }
}
