import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { Pill } from "../../components/ui/Pill";

interface VitalParam {
  name: string;
  range: string;
  notes: string;
  badge: string;
}

const VITAL_SIGNS: VitalParam[] = [
  {
    name: "Blood Pressure (BP)",
    range: "< 120 / 80 mmHg",
    notes:
      "AHA 2023 Guidelines: Normal = <120/<80; Elevated = 120–129/<80; Stage 1 HTN = 130–139/80–89; Stage 2 HTN = ≥140/90; Hypertensive Crisis = >180 and/or >120.",
    badge: "Cardiovascular",
  },
  {
    name: "Heart Rate (Pulse)",
    range: "60 – 100 bpm",
    notes:
      "NIH StatPearls: Resting adult rate. <60 bpm = bradycardia (normal baseline in well-trained athletes); >100 bpm = tachycardia.",
    badge: "Cardiovascular",
  },
  {
    name: "Respiratory Rate (RR)",
    range: "12 – 20 breaths/min",
    notes:
      "NIH StatPearls: Adult at rest. <12 = bradypnea (e.g. opioid depression); >20 = tachypnea (e.g. hypoxia, acidosis, distress).",
    badge: "Respiratory",
  },
  {
    name: "Oxygen Saturation (SpO2)",
    range: "95 – 100 %",
    notes:
      "WHO Pulse Oximetry Manual: Room air. <92% warrants urgent evaluation; <90% indicates hypoxaemia requiring immediate clinical response.",
    badge: "Respiratory",
  },
  {
    name: "Body Temperature (Oral)",
    range: "36.1 – 37.2 °C (97.0 – 99.0 °F)",
    notes:
      "NIH MedlinePlus: Normal physiological baseline. Fever threshold ≥38.0°C (100.4°F). Rectal ≈ +0.5°F higher; Axillary ≈ -0.5°F lower.",
    badge: "Thermoregulation",
  },
];

export default function VitalSignsScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Title */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Text className="text-xl font-bold text-navy dark:text-white mb-2 tracking-tight font-sans">
          Adult Vital Signs Reference
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 font-sans">
          Standard physiological baseline reference ranges for healthy adult patients.
        </Text>
      </View>

      {/* Vital Cards */}
      <View className="space-y-4 mb-6">
        {VITAL_SIGNS.map((item, idx) => (
          <View key={idx} className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-navy dark:text-white font-bold text-base flex-1 mr-2 font-sans">
                {item.name}
              </Text>
              <Pill label={item.badge} variant="trust" size="sm" />
            </View>

            <View className="bg-warm-bg dark:bg-slate-950 p-4 rounded-xl border border-border-subtle dark:border-slate-800 mb-3">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 font-sans">
                Normal Adult Range
              </Text>
              <Text className="text-clinical-pine dark:text-teal-400 font-extrabold text-lg font-sans">
                {item.range}
              </Text>
            </View>

            <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5 font-sans">
              {item.notes}
            </Text>
          </View>
        ))}
      </View>

      {/* Scope Disclaimer */}
      <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider font-sans">
          ⚠ Population Scope Notice
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5 font-sans">
          Adult baseline reference ranges only. Ranges vary significantly for
          paediatric, neonatal, pregnant, or critical care patients. Always document
          and evaluate vitals in patient context per facility protocol.
        </Text>
      </View>
    </AppScreen>
  );
}
