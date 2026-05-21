import { useState, useMemo, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  Select,
  Button,
  Avatar,
  ConfigProvider,
  Modal,
  Divider,
  Form,
  Steps,
  Input,
  notification,
  Checkbox,
} from "antd";
import {
  EnvironmentOutlined,
  SearchOutlined,
  TrophyOutlined,
  ClearOutlined,
  CheckCircleFilled,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  BookOutlined,
} from "@ant-design/icons";
import start from "./assets/start.png";
import { stepSchemas } from "./schema";
import moment from "moment";

const { Option } = Select;

const C = {
  yellow: "#F7AD00",
  orange: "#EE7320",
  red: "#E40034",
  navy: "#113350",
  navyDark: "#0b2340",
  white: "#ffffff",
  bg: "#f9fafb",
  surface: "#ffffff",
  text: "#1a2433",
  muted: "#64748b",
  border: "#e2e8f0",
  yellowTint: "#FFF8E1",
  orangeTint: "#FFF3EB",
  redTint: "#FFF0F3",
  navyTint: "#EEF3F8",
};

const maskCep = (value: string) => {
  return value
    ?.replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
};

const maskCpf = (value: string) => {
  return value
    ?.replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const parseCurrencyBRL = (value?: string): number => {
  if (!value) return 0;

  const numeric = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  return Number(numeric);
};

export const maskCurrencyBRL = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  const amount = Number(numbers) / 100;

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const sexoOptions = [
  { label: "Masculino", value: "MASCULINO" },
  { label: "Feminino", value: "FEMININO" },
  { label: "Outro", value: "OUTRO" },
  { label: "Prefiro não informar", value: "NAO_INFORMAR" },
];

const estadoCivilOptions = [
  { label: "Solteiro(a)", value: "SOLTEIRO" },
  { label: "Casado(a)", value: "CASADO" },
  { label: "Divorciado(a)", value: "DIVORCIADO" },
  { label: "Separado(a)", value: "SEPARADO" },
  { label: "Viúvo(a)", value: "VIUVO" },
  { label: "União Estável", value: "UNIAO_ESTAVEL" },
];

export const formatBirthDate = (value: string): string => {
  if (!value) return "";
  const original = value.trim();
  const digits = original.replace(/\D/g, "").slice(0, 8);
  const looksLikeIso = /^\d{4}-\d{2}-\d{2}$/.test(original);
  const firstFour = digits.slice(0, 4);
  const firstFourNum = firstFour ? Number(firstFour) : NaN;
  const plausibleYear =
    !Number.isNaN(firstFourNum) && firstFourNum >= 1900 && firstFourNum <= 2100;

  if (looksLikeIso || (digits.length === 8 && plausibleYear)) {
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);

    if (d.length === 2) return `${d}/${m}/${y}`;
    if (m.length === 2) return `${m}/${y}`;
    return y;
  }

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

function formatDate(iso: any) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const COTA_CFG: any = {
  PCD: {
    label: "PCD",
    desc: "Pessoa com Deficiência",
    icon: <SafetyOutlined />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    avatarBg: "#7c3aed",
  },
  IDOSO: {
    label: "Idoso",
    desc: "Pessoa Idosa",
    icon: <UserOutlined />,
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#7dd3fc",
    avatarBg: "#0369a1",
  },
  VULNERABILIDADE: {
    label: "Vulnerabilidade",
    desc: "Situação de Vulnerabilidade",
    icon: <TeamOutlined />,
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fcd34d",
    avatarBg: "#b45309",
  },
  AMPLA_CONCORRENCIA: {
    label: "Ampla Concorrência",
    desc: "Concorrência Geral",
    icon: <ThunderboltOutlined />,
    color: "#065f46",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    avatarBg: "#065f46",
  },
};

const COTAS_ORDER = ["PCD", "IDOSO", "VULNERABILIDADE", "AMPLA_CONCORRENCIA"];

// ── Keyframes ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const cardReveal = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
`;
const barGrow = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

// ── Global ─────────────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${C.bg}; color: ${C.text}; min-height: 100vh; -webkit-font-smoothing: antialiased; }

  .ant-select-selector { border-radius: 10px !important; border-color: ${C.border} !important; height: 46px !important; align-items: center !important; font-family: 'Inter', sans-serif !important; }
  .ant-select-selection-placeholder, .ant-select-selection-item { font-size: 14px !important; display: flex !important; align-items: center !important; font-family: 'Inter', sans-serif !important; }
  .ant-select:not(.ant-select-disabled):hover .ant-select-selector { border-color: ${C.orange} !important; }
  .ant-select-focused .ant-select-selector { border-color: ${C.orange} !important; box-shadow: 0 0 0 3px rgba(238,115,32,0.15) !important; }
  .ant-select-dropdown { border-radius: 12px !important; font-family: 'Inter', sans-serif !important; box-shadow: 0 8px 32px rgba(17,51,80,0.12) !important; }
  .ant-select-item-option-active { background: ${C.orangeTint} !important; }
  .ant-select-item-option-selected { background: ${C.navyTint} !important; color: ${C.navy} !important; font-weight: 500 !important; }
  .ant-btn { font-family: 'Inter', sans-serif !important; border-radius: 10px !important; height: 46px !important; font-size: 14px !important; font-weight: 500 !important; }
`;

// ── Styled Components ───────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  /* background: ${C.bg}; */
  background: #ffffff;
`;

const StartLogo = styled.img`
  /* height: 100px; */
  width: 120px;
  object-fit: contain;
  margin-left: 0px;
`;

const ResultsMeta = styled.div`
  margin-bottom: 28px;
  animation: ${fadeUp} 0.4s ease both;
`;

const Hero = styled.section`
  /* background: ${C.navy}; */
  background: white;
  position: relative;
  overflow: hidden;
  padding-bottom: 72px;
  &::before {
    content: "";
    position: absolute;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    border: 80px solid rgba(247, 173, 0, 0.07);
    top: -160px;
    right: -100px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 60px solid rgba(238, 115, 32, 0.06);
    bottom: -120px;
    left: -60px;
    pointer-events: none;
  }
`;

const GridCriterios = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    margin-top: 0px;
  }
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  justify-items: stretch;
  align-items: stretch;
`;

const LabelSub = styled.span`
  font-family: Inter;
  font-weight: 200;
  font-size: 1.1rem;
  color: #5d5d5d;
`;

const GridAddress = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    margin-top: 0px;
  }
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  justify-items: stretch;
  align-items: stretch;
`;

const GridFamilyData = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    margin-top: 0px;
  }
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  justify-items: stretch;
  align-items: stretch;
`;

const AccentBar = styled.div`
  height: 4px;
  background: linear-gradient(
    90deg,
    ${C.yellow} 0%,
    ${C.orange} 50%,
    ${C.red} 100%
  );
  transform-origin: left;
  animation: ${barGrow} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  @media (max-width: 600px) {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeUp} 0.6s ease both;
`;

const ResultsDate = styled.p`
  font-size: 12px;
  color: ${C.muted};
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const HeroContent = styled.div`
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  padding: 60px 24px 0;
  animation: ${fadeUp} 0.7s 0.15s ease both;
`;

const HeroTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: clamp(30px, 5vw, 50px);
  font-weight: 700;
  line-height: 1.18;
  /* color: ${C.white}; */
  color: black;
  margin-bottom: 18px;
  em {
    font-style: normal;
    color: ${C.orange};
  }
`;

const HeroSub = styled.p`
  font-size: 15px;
  /* color: rgba(255, 255, 255, 0.6); */
  color: rgba(82, 82, 82, 0.6);
  line-height: 1.75;
  max-width: 500px;
  margin: 0 auto 44px;
  font-weight: 300;
`;

const FilterWrap = styled.div`
  max-width: 1040px;
  margin: -36px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 10;
  animation: ${slideDown} 0.6s 0.3s ease both;
  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const FilterCard = styled.div`
  background: ${C.white};
  border-radius: 18px;
  padding: 28px 32px;
  box-shadow: 0 12px 40px rgba(17, 51, 80, 0.14),
    0 2px 8px rgba(17, 51, 80, 0.06);
  border: 1px solid rgba(17, 51, 80, 0.06);
  @media (max-width: 600px) {
    padding: 20px 16px;
  }
`;

const FilterHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  span {
    font-family: "Sora", sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: ${C.navy};
  }
  svg {
    color: ${C.orange};
    font-size: 17px;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;
  align-items: end;
  .btn-group {
    display: flex;
    gap: 10px;
    height: 40px;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
    .btn-group {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 460px) {
    grid-template-columns: 1fr;
    .btn-group {
      grid-column: 1;
    }
  }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: ${C.muted};
  text-transform: uppercase;
  letter-spacing: 0.09em;
  margin-bottom: 7px;
`;

const ResultsSection = styled.section`
  max-width: 1040px;
  margin: 0 auto;
  padding: 44px 24px 80px;
  @media (max-width: 600px) {
    padding: 32px 16px 60px;
  }
`;

const ResultsTitle = styled.h3`
  font-family: "Sora", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${C.navy};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div<any>`
  background: ${C.white};
  border-radius: 16px;
  padding: 22px;
  border: 1px solid ${C.border};
  box-shadow: 0 2px 10px rgba(17, 51, 80, 0.05);
  position: relative;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease,
    border-color 0.22s ease;
  animation: ${cardReveal} 0.4s ease both;
  animation-delay: ${(p): any => p.$delay}ms;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, ${C.yellow}, ${C.orange});
    border-radius: 16px 0 0 16px;
  }
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(17, 51, 80, 0.12);
    border-color: rgba(238, 115, 32, 0.25);
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;
const CheckBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 17px;
  height: 17px;
  background: ${C.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #22c55e;
`;
const DrawNum = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${C.muted};
  background: ${C.bg};
  padding: 3px 9px;
  border-radius: 100px;
  border: 1px solid ${C.border};
`;
const CardName = styled.h4<any>`
  font-family: "Sora", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${C.navy};
  margin-bottom: 3px;
  line-height: 1.35;
`;

// ── Cota group ─────────────────────────────────────────────────────────────
const CotaBlock = styled.div<any>`
  margin-bottom: 44px;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${(p) => p.$delay}ms;
`;

const ReservaBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: ${C.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: ${C.muted};
  font-family: "Sora", sans-serif;
  border: 1px solid ${C.border};
`;

const CotaHeader = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 14px;
  margin-bottom: 18px;
  background: ${(p): any => p.$bg};
  border: 1px solid ${(p): any => p.$border};
`;

const CotaTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CotaIconWrap = styled.div<any>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${(p) => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  color: ${(p) => p.$color};
`;

const CotaInfo = styled.div<any>`
  h4 {
    font-family: "Sora", sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: ${(p) => p.$color};
  }
  span {
    font-size: 11px;
    color: ${(p) => p.$color}aa;
  }
`;

const CotaPills = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
`;

const MetaPill = styled.span<any>`
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$border};
`;

// ── Sub-section label ──────────────────────────────────────────────────────
const SubLabel = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  h5 {
    font-family: "Sora", sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: ${(p) => (p.$muted ? C.muted : C.navy)};
  }
`;

const SubCount = styled.span<any>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const SubSection = styled.div`
  margin-bottom: 20px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const CardSub = styled.p`
  font-size: 11px;
  color: ${C.muted};
  margin-bottom: 14px;
`;

const ReservaCard = styled(Card)`
  background: ${C.bg};
  &::before {
    background: ${C.border};
  }
  &:hover {
    border-color: ${C.border};
    transform: translateY(-2px);
  }
`;

const WrapperSteps = styled.div`
  box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,
    rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,
    rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,
    rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
    rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,
    rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,
    rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
`;

const NavPill = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: rgba(80, 53, 17, 0.06);
  border: 1px solid rgba(17, 51, 80, 0.1);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  color: ${C.navy};
  animation: ${fadeUp} 0.6s 0.1s ease both;
  svg {
    font-size: 13px;
  }
  @media (max-width: 420px) {
    display: flex;
    width: 100%;
  }
`;

const GridPersonalData = styled.div`
  /* padding: 25px 20px; */
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    margin-top: 0px;
  }
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  justify-items: stretch;
  align-items: stretch;
`;

const antTheme = {
  token: {
    colorPrimary: C.navy,
    borderRadius: 10,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Button: { colorPrimary: C.navy, colorPrimaryHover: C.navyDark },
    Select: { colorPrimary: C.orange },
  },
};

// ── CotaSection sub-component ──────────────────────────────────────────────
function CotaSection({ cotaKey, data, blockDelay }: any) {
  const cfg: any = COTA_CFG[cotaKey] || {
    label: cotaKey,
    desc: "",
    icon: null,
    color: C.navy,
    bg: C.navyTint,
    border: C.border,
    avatarBg: C.navy,
  };

  const sorteados = data.sorteados || [];
  const reservas = data.cadastroReserva || [];

  return (
    <CotaBlock $delay={blockDelay}>
      <CotaHeader $bg={cfg.bg} $border={cfg.border}>
        <CotaTitleRow>
          <CotaIconWrap $color={cfg.color}>{cfg.icon}</CotaIconWrap>
          <CotaInfo $color={cfg.color}>
            <h4>{cfg.label}</h4>
            <span>{cfg.desc}</span>
          </CotaInfo>
        </CotaTitleRow>
        <CotaPills>
          <MetaPill
            $bg={`${cfg.color}15`}
            $color={cfg.color}
            $border={`${cfg.color}30`}
          >
            {sorteados.length} sorteado{sorteados.length !== 1 ? "s" : ""}
          </MetaPill>
          <MetaPill $bg={C.bg} $color={C.muted} $border={C.border}>
            {data.totalVagas} vagas
          </MetaPill>
          {reservas.length > 0 && (
            <MetaPill $bg={C.bg} $color={C.muted} $border={C.border}>
              {reservas.length} em reserva
            </MetaPill>
          )}
        </CotaPills>
      </CotaHeader>

      {/* Sorteados */}
      <SubSection>
        <SubLabel>
          <CheckCircleFilled style={{ color: cfg.color, fontSize: 13 }} />
          <h5>Sorteados</h5>
          <SubCount $bg={`${cfg.color}12`} $color={cfg.color}>
            {sorteados.length}
          </SubCount>
        </SubLabel>
        <CardsGrid>
          {sorteados.map((s: any, i: any) => (
            <Card
              key={s.id}
              $delay={i * 45}
              $accent={cfg.color}
              $accentLight={`${cfg.color}35`}
            >
              <CardTop>
                <AvatarWrap>
                  <Avatar
                    size={46}
                    style={{
                      background: cfg.avatarBg,
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    {s.nome[0]}
                  </Avatar>
                  <CheckBadge>
                    <CheckCircleFilled />
                  </CheckBadge>
                </AvatarWrap>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <MetaPill
                    $bg={`${cfg.color}12`}
                    $color={cfg.color}
                    $border={`${cfg.color}25`}
                  >
                    {cfg.label}
                  </MetaPill>
                  <DrawNum>#{String(i + 1).padStart(3, "0")}</DrawNum>
                </div>
              </CardTop>

              <CardName>{s.nome}</CardName>
              <CardSub>Contemplado — {cfg.desc}</CardSub>
            </Card>
          ))}
        </CardsGrid>
      </SubSection>

      {/* Cadastro de Reserva */}
      {reservas.length > 0 && (
        <SubSection>
          <SubLabel $muted>
            <BookOutlined style={{ color: C.muted, fontSize: 13 }} />
            <h5>Cadastro de Reserva</h5>
            <SubCount $bg={C.bg} $color={C.muted}>
              {reservas.length}
            </SubCount>
          </SubLabel>
          <CardsGrid>
            {reservas?.map((r: any, i: any) => (
              <ReservaCard key={r.id} $delay={i * 35}>
                <CardTop>
                  <AvatarWrap>
                    <Avatar
                      size={46}
                      style={{
                        background: "#94a3b8",
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 17,
                        fontWeight: 700,
                      }}
                    >
                      {r.nome[0]}
                    </Avatar>
                    <ReservaBadge>R</ReservaBadge>
                  </AvatarWrap>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                    }}
                  >
                    <MetaPill $bg={C.bg} $color={C.muted} $border={C.border}>
                      Reserva
                    </MetaPill>
                    <DrawNum>R{String(i + 1).padStart(2, "0")}</DrawNum>
                  </div>
                </CardTop>

                <CardName $muted>{r.nome}</CardName>
                <CardSub>Cadastro de Reserva — {cfg.label}</CardSub>
              </ReservaCard>
            ))}
          </CardsGrid>
        </SubSection>
      )}
    </CotaBlock>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [local, setLocal] = useState<any>(null);
  const [empreendimentos, setEmpreendimentos] = useState<any>(null);
  const [municipios, setMunicipios] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [sorteio, setSorteio] = useState<any>(null);
  const [vagas, setVagas] = useState<any>(null);
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    async function fetchEmpreendimentos() {
      try {
        const response = await fetch(
          "https://sga.startconsultorianet.com/public/empreendimentos?page=0&limit=10"
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const dados = await response.json();

        setEmpreendimentos(dados!?.rows);
      } catch (error) {}
    }

    fetchEmpreendimentos();
  }, []);

  useEffect(() => {
    async function fetchMunicipios() {
      try {
        const response = await fetch(
          "https://sga.startconsultorianet.com/public/municipios"
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const dados = await response.json();

        setMunicipios(dados);
      } catch (error) {}
    }

    fetchMunicipios();
  }, []);

  async function enviarDados() {
    if (local !== null)
      try {
        setLoading(true);

        const response = await fetch(
          `https://sga.startconsultorianet.com/public/sorteio/ultimo/?idEmpreendimento=${local}`
        );

        const dados = await response.json();
        const resultado = dados!?.resultado;
        const vagas = resultado!?.vagas;
        setSorteio(dados);
        setResultado(resultado);
        setVagas(vagas);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
  }

  const cotasToShow = useMemo(
    () => COTAS_ORDER?.filter((k) => vagas?.[k]),
    [vagas, resultado]
  );

  const totalSorteados = cotasToShow?.reduce(
    (acc, k) => acc + (vagas[k]?.sorteados?.length || 0),
    0
  );

  const [registerModal, setOpenRegisterModal] = useState<boolean>(false);
  const [updateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [current]);

  const next = async () => {
    try {
      const schema = stepSchemas[current];
      const fields = Object.keys(schema.fields);
      const values = form.getFieldsValue(fields);

      await schema.validate(values, { abortEarly: false });

      setFormData((prev: any) => ({ ...prev, ...values }));
      setCurrent((prev) => prev + 1);
    } catch (err: any) {
      if (err.inner) {
        form.setFields(
          err.inner.map((e: any) => ({
            name: e.path,
            errors: [e.message],
          }))
        );
      }
    }
  };

  const prev = async () => {
    const values = form.getFieldsValue();
    setFormData({ ...formData, ...values });
    setCurrent(current - 1);
  };

  const [loadingCep, setLoadingCep] = useState(false);
  const numeroRef: any = useRef(null);
  const debounceRef: any = useRef(null);

  const handleCepLookup = async (cep: any) => {
    const cleanCep = cep?.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    setLoadingCep(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        notification.error({
          message: "Endereço não encontrado",
          description: "Endereço não encontrado insira manualmente",
        });
        return;
      }

      form.setFieldsValue({
        logradouro: data.logradouro || undefined,
        bairro: data.bairro || undefined,
        cidade: data.localidade || undefined,
        estado: data.uf || undefined,
        complemento: data.complemento || undefined,
      });

      setTimeout(() => {
        numeroRef.current?.focus();
      }, 100);
    } catch {
      notification.error({
        message: "Erro ao buscar CEP",
        description: "Endereço não encontrado insira manualmente",
      });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e: any) => {
    const masked = maskCep(e.target.value);
    form.setFieldValue("cep", masked);

    clearAddressFields();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef!.current = setTimeout(() => {
      handleCepLookup(masked);
    }, 600);
  };

  const handleCpfChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpf", masked);
  };

  const handleCpfConjugeChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfConjuge", masked);
  };

  const clearAddressFields = () => {
    form.setFieldsValue({
      logradouro: undefined,
      bairro: undefined,
      cidade: undefined,
      estado: undefined,
      complemento: undefined,
    });
  };

  const steps = [
    {
      title: "Dados Pessoais",
      content: (
        <>
          {/* DADOS PESSOAIS */}
          <Divider style={{ margin: "20px 0px" }}>Dados Pessoais</Divider>
          <GridPersonalData>
            <Form.Item
              name="idMunicipio"
              label="Municipio de Cadastro"
              required
            >
              <Select
                size="large"
                placeholder="Selecione"
                options={municipios!?.map((item: any) => {
                  return {
                    label: item?.nome,
                    value: item?.id,
                  };
                })}
                allowClear
              />
            </Form.Item>

            <Form.Item name="cpf" label="CPF" required>
              <Input
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                size="large"
                maxLength={14}
              />
            </Form.Item>

            <Form.Item name="nis" label="NIS" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="nome" label="Nome" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="rg" label="RG" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="orgao" label="Órgão" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="estado" label="Estado" required>
              <Input
                size="large"
                onChange={(e) => {
                  form.setFieldValue("estado", e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="dataNascimento"
              label="Data de Nascimento"
              required
            >
              <Input
                size="large"
                onChange={(e) => {
                  form.setFieldsValue({
                    dataNascimento: formatBirthDate(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item name="estadoCivil" label="Estado Civil" required>
              <Select
                size="large"
                placeholder="Selecione"
                options={estadoCivilOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item name="sexo" label="Sexo" required>
              <Select
                size="large"
                placeholder="Selecione"
                options={sexoOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item name="email" label="E-mail" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="telefone1" label="Telefone 1" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="telefone2" label="Telefone 2">
              <Input size="large" />
            </Form.Item>

            <Form.Item name="mae" label="Nome da Mãe" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="rendaPessoal" label="Renda Pessoal" required>
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("rendaPessoal")}
                onChange={(e) => {
                  form.setFieldsValue({
                    rendaPessoal: maskCurrencyBRL(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item name="profissao" label="Profissão" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="emancipado"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Emancipado</Checkbox>
            </Form.Item>

            <Form.Item
              name="chefeDeFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Chefe de Família</Checkbox>
            </Form.Item>

            <Form.Item
              name="possuiDeficiencia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Possui Deficiência</Checkbox>
            </Form.Item>

            <Form.Item name="deficiencia" label="Nome da deficiência">
              <Input size="large" />
            </Form.Item>
          </GridPersonalData>

          {/*FINAL DADOS PESSOAIS */}

          {/*INCICIO SITUAÇÃO FAMILIAR */}
          <Divider style={{ margin: "20px 0px" }}>Situação Familiar</Divider>
          <GridFamilyData>
            <Form.Item
              name="totalPessoas"
              label="Total pessoas"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : false
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>

            <Form.Item
              name="rendaFamiliar"
              label="Renda familiar"
              required
              // getValueFromEvent={(e) =>
              //   e.target.value ? Number(e.target.value) : undefined
              // }
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("rendaFamiliar")}
                onChange={(e) => {
                  form.setFieldsValue({
                    rendaFamiliar: maskCurrencyBRL(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item name="condicaoMoradia" label="Condição moradia" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="recebemBolsaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Recebem bolsa família</Checkbox>
            </Form.Item>

            <Form.Item
              name="deficientesNaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Deficientes na família</Checkbox>
            </Form.Item>

            <Form.Item
              name="idososNaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Idosos na família</Checkbox>
            </Form.Item>

            <Form.Item name="tipoMoradia" label="Tipo moradia" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="trabalhoOcupacao"
              label="Trabalho ocupação"
              required
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="filhos0a6Anos"
              label="Filhos de 0 a 6 anos"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>

            <Form.Item
              name="filhos7a18Anos"
              label="Filhos de 7 a 18 anos"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>
          </GridFamilyData>
          {/*FINAL SITUAÇÃO FAMILIAR */}

          <Divider style={{ margin: "20px 0px" }}>Endereço</Divider>
          {/* ...continuação endereço */}
          <GridAddress>
            <Form.Item name="cep" label="CEP" required>
              <Input
                placeholder="00000-000"
                onChange={handleCepChange}
                disabled={loadingCep}
                size="large"
              />
            </Form.Item>
            <Form.Item name="logradouro" label="Logradouro" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="numero" label="Nº imóvel" required>
              <Input ref={numeroRef} size="large" />
            </Form.Item>
            <Form.Item name="bairro" label="Bairro" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="cidade" label="Cidade" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="complemento" label="Complemento" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="localStatusInscricao" // nome municipio
              label="Local do status inscrição"
              required
            >
              <Input size="large" />
            </Form.Item>
          </GridAddress>
        </>
      ),
    },
    {
      title: "Situação Conjuge",
      content: (
        <>
          <Divider style={{ margin: "20px 0px" }}>Situação Conjuge</Divider>
          <GridAddress>
            <Form.Item name="cpfConjuge" label="CPF" required>
              <Input
                placeholder="000.000.000-00"
                onChange={handleCpfConjugeChange}
                size="large"
                // disabled={loadingCep}
              />
            </Form.Item>
            <Form.Item name="nomeConjuge" label="Nome cônjuge" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="estadoCivilConjuge" label="Estado civil" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="profissaoConjuge" label="Profissão" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="rgConjuge" label="RG" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="rendaConjuge"
              label="Renda"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("rendaConjuge")}
                onChange={(e) => {
                  form.setFieldsValue({
                    rendaConjuge: maskCurrencyBRL(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="possuiDeficienciaConjuge" // nome municipio
              label="Cônjuge possui deficiencia"
              required
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="conjugeVaraoAusente" // nome municipio
              label="Cônjuge varão ausente"
              required
            >
              <Input size="large" />
            </Form.Item>
          </GridAddress>
        </>
      ),
    },
    {
      title: "Critérios Priorização",
      content: (
        <>
          <LabelSub style={{ fontWeight: "300" }}>
            Critérios de Priorização
          </LabelSub>
          <Divider />
          <GridCriterios>
            <Form.Item
              name="mulherResponsavelUnidadeFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Mulher responsável pela unidade familiar</Checkbox>
            </Form.Item>

            <Form.Item
              name="titularOuConjugeNegro"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Titular ou cônjuge negro</Checkbox>
            </Form.Item>

            <Form.Item
              name="pessoaComDeficienciaNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Pessoa com deficiência na composição familiar</Checkbox>
            </Form.Item>

            <Form.Item
              name="idosoNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Idosos na composição familiar</Checkbox>
            </Form.Item>

            <Form.Item
              name="criancaOuAdolescenteNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Criança ou adolescente na composição familiar</Checkbox>
            </Form.Item>
            <Form.Item
              name="pessoaComCancerOuDoencaRaraCronicaDegenerativa"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>
                Pessoa com cancer ou doença rara cronica degenerativa
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="mulherVitimaViolenciaDomestica"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Mulher vítima de violência doméstica</Checkbox>
            </Form.Item>
            <Form.Item
              name="situacaoRiscoVulnerabilidade"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Situação de risco e vulnerabilidade</Checkbox>
            </Form.Item>
            <Form.Item
              name="povosTradicionaisQuilombolas"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Povos tradicionais e quilombolas</Checkbox>
            </Form.Item>
            <Form.Item
              name="residentesEmAreasDeRisco"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Residentes em área de risco</Checkbox>
            </Form.Item>
            <Form.Item
              name="situacaoDeRuaOuTrajetoriaRua"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>
                Encontra-se em situação de rua ou com trajetória
              </Checkbox>
            </Form.Item>
          </GridCriterios>
        </>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await stepSchemas[current].validate(values, { abortEarly: false });

      const payload = {
        ...formData,
        ...values,
        rendaPessoal: parseCurrencyBRL(formData!?.rendaPessoal),
        rendaConjuge: parseCurrencyBRL(formData!?.rendaConjuge),
        rendaFamiliar: parseCurrencyBRL(formData!?.rendaFamiliar),
        cpf: formData!?.cpf!?.replace(/[^a-zA-Z0-9]/g, ""),
        dataNascimento: moment(formData!?.dataNascimento, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        ),
        idMunicipio: formData!?.idMunicipio,
        uf: formData!?.estado,
      };

      try {
        const res = await fetch(
          "https://sga.startconsultorianet.com/public/beneficiarios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao enviar dados");
        }

        if (res.status === 200 || res.status === 201) {
          form.resetFields();
          setFormData({});
          setCurrent(0);
          notification.success({
            duration: 3,
            message: "Sucesso!",
            description: `Beneficiario cadastrado.`,
          });
        }
      } catch (error: any) {
        notification.error({
          duration: 1,
          message: "Erro!",
          description: `${error}`,
        });
      }
    } catch (err: any) {
      if (err.inner) {
        const errors: any = {};
        err.inner.forEach((e: any) => {
          errors[e.path] = {
            value: form.getFieldValue(e.path),
            errors: [new Error(e.message)],
          };
        });
        form.setFields(
          Object.keys(errors).map((field) => ({
            name: field,
            errors: errors[field].errors,
          }))
        );
      }
    }
  };

  const [userId, setUserId] = useState<string>("");

  const handleSubmitPatch = async () => {
    try {
      const values = await form.validateFields();
      await stepSchemas[current].validate(values, { abortEarly: false });

      const payload = {
        ...formData,
        ...values,

        cpf: formData!?.cpf!?.replace(/[^a-zA-Z0-9]/g, ""),
        dataNascimento: moment(formData!?.dataNascimento, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      try {
        const res = await fetch(
          `https://sga.startconsultorianet.com/public/beneficiarios/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao enviar dados");
        }

        if (res.status === 200 || res.status === 201) {
          form.resetFields();
          setFormData({});
          setCurrent(0);
          setHash("");
          setUserId("");
          setOpenUpdateModal(false);
          notification.success({
            duration: 3,
            message: "Sucesso!",
            description: `Beneficiario atualizado.`,
          });
        }
      } catch (error: any) {
        notification.error({
          duration: 1,
          message: "Erro!",
          description: `${error}`,
        });
      }
    } catch (err: any) {
      if (err.inner) {
        const errors: any = {};
        err.inner.forEach((e: any) => {
          errors[e.path] = {
            value: form.getFieldValue(e.path),
            errors: [new Error(e.message)],
          };
        });
        form.setFields(
          Object.keys(errors).map((field) => ({
            name: field,
            errors: errors[field].errors,
          }))
        );
      }
    }
  };

  useEffect(() => {
    if (updateModal === false && hash) {
      form.resetFields();
      setFormData({});
      setCurrent(0);
      setHash("");
      setUserId("");
      setOpenUpdateModal(false);
    }
  }, [updateModal]);

  const [hash, setHash] = useState<string>("");

  async function sha256(text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  const handleSearch = async (value: string) => {
    const hashedValue = await sha256(value);
    setHash(hashedValue);
  };

  async function fetchUserData() {
    if (hash !== null)
      try {
        const response = await fetch(
          `https://sga.startconsultorianet.com//public/beneficiarios/cpf/${hash}`
        );

        const userData = await response.json();
        setUserId(userData!?.id);
        form.setFieldsValue({
          idMunicipio: userData!?.idMunicipio,
          cpf: maskCpf(userData!?.cpf),
          nis: userData!?.nis,
          nome: userData!?.nome,
          rg: userData!?.rg,
          orgao: userData!?.orgao,
          estado: userData!?.estado,
          dataNascimento: formatBirthDate(userData!?.dataNascimento),
          estadoCivil: userData!?.estadoCivil,
          sexo: userData!?.sexo,
          email: userData!?.email,
          telefone1: userData!?.telefone1,
          telefone2: userData!?.telefone2,
          mae: userData!?.mae,
          rendaPessoal: userData!?.rendaPessoal,
          profissao: userData!?.profissao,
          emancipado: userData!?.emancipado,
          chefeDeFamilia: userData!?.chefeDeFamilia,
          possuiDeficiencia: userData!?.possuiDeficiencia,
          deficiencia: userData!?.deficiencia,
          totalPessoas: userData!?.totalPessoas,
          rendaFamiliar: userData!?.rendaFamiliar,
          condicaoMoradia: userData!?.condicaoMoradia,
          recebemBolsaFamilia: userData!?.recebemBolsaFamilia,
          deficientesNaFamilia: userData!?.deficientesNaFamilia,
          idososNaFamilia: userData!?.idososNaFamilia,
          tipoMoradia: userData!?.tipoMoradia,
          trabalhoOcupacao: userData!?.trabalhoOcupacao,
          filhos0a6Anos: userData!?.filhos0a6Anos,
          filhos7a18Anos: userData!?.filhos7a18Anos,
          cep: userData!?.cep,
          logradouro: userData!?.logradouro,
          numero: userData!?.numero,
          bairro: userData!?.bairro,
          cidade: userData!?.cidade,
          complemento: userData!?.complemento,
          localStatusInscricao: userData!?.localStatusInscricao,
          cpfConjuge: userData!?.cpfConjuge,
          nomeConjuge: userData!?.nomeConjuge,
          estadoCivilConjuge: userData!?.estadoCivilConjuge,
          profissaoConjuge: userData!?.profissaoConjuge,
          rgConjuge: userData!?.rgConjuge,
          rendaConjuge: userData!?.rendaConjuge,
          possuiDeficienciaConjuge: userData!?.possuiDeficienciaConjuge,
          conjugeVaraoAusente: userData!?.conjugeVaraoAusente,
          mulherResponsavelUnidadeFamiliar:
            userData!?.mulherResponsavelUnidadeFamiliar,
          titularOuConjugeNegro: userData!?.titularOuConjugeNegro,
          pessoaComDeficienciaNaComposicaoFamiliar:
            userData!?.pessoaComDeficienciaNaComposicaoFamiliar,
          idosoNaComposicaoFamiliar: userData!?.idosoNaComposicaoFamiliar,
          criancaOuAdolescenteNaComposicaoFamiliar:
            userData!?.criancaOuAdolescenteNaComposicaoFamiliar,
          pessoaComCancerOuDoencaRaraCronicaDegenerativa:
            userData!?.pessoaComCancerOuDoencaRaraCronicaDegenerativa,
          mulherVitimaViolenciaDomestica:
            userData!?.mulherVitimaViolenciaDomestica,
          situacaoRiscoVulnerabilidade: userData!?.situacaoRiscoVulnerabilidade,
          povosTradicionaisQuilombolas: userData!?.povosTradicionaisQuilombolas,
          residentesEmAreasDeRisco: userData!?.residentesEmAreasDeRisco,
          situacaoDeRuaOuTrajetoriaRua: userData!?.situacaoDeRuaOuTrajetoriaRua,
        });

        const values = form.getFieldsValue();
        setFormData({ ...formData, ...values });

        // setSorteio(dados);
        // setResultado(resultado);
        // setVagas(vagas);
        // setLoading(false);
      } catch (error) {}
  }

  useEffect(() => {
    if (hash) fetchUserData();
  }, [hash]);

  return (
    <ConfigProvider theme={antTheme}>
      <GlobalStyle />
      <Page>
        <Hero>
          <AccentBar />
          <Navbar>
            <Logo>
              <StartLogo src={start} />
            </Logo>

            <NavPill>
              <Button
                style={{
                  flex: 1,
                  background: C.white,
                  borderColor: C.border,
                  maxHeight: "40px",
                  color: "black",
                }}
                onClick={() => setOpenUpdateModal(true)}
              >
                Atualizar cadastro
              </Button>
              <Button
                style={{
                  flex: 1,
                  background: C.orange,
                  borderColor: C.white,
                  maxHeight: "40px",
                  color: "white",
                }}
                onClick={() => setOpenRegisterModal(true)}
              >
                Cadastrar-me
              </Button>
            </NavPill>
          </Navbar>
          <HeroContent>
            <HeroTitle>
              Cada família contemplada
              <br />
              <em>dá um passo rumo ao seu lar</em>
            </HeroTitle>
            <HeroSub>
              Consulte os contemplados nas hierarquizações de unidades
              habitacionais. Transparência e dignidade para quem mais precisa.
            </HeroSub>
          </HeroContent>
        </Hero>

        <FilterWrap>
          <FilterCard>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "start",
                flexDirection: "row",
              }}
            >
              <FilterHead>
                <SearchOutlined />
                <span>Filtrar hierarquizações realizados</span>
              </FilterHead>
              <div
                style={{
                  marginLeft: "auto",
                  gap: "10px",
                  display: "flex",
                  paddingRight: "13px",
                }}
              >
                {/* <Button
                  style={{
                    flex: 1,
                    background: C.white,
                    borderColor: C.text,
                    maxHeight: "40px",
                    color: "black",
                  }}
                >
                  Atualizar cadastro
                </Button>
                <Button
                  style={{
                    flex: 1,
                    background: C.orange,
                    borderColor: C.white,
                    maxHeight: "40px",
                    color: "white",
                  }}
                  onClick={() => setOpenRegisterModal(true)}
                >
                  Cadastrar-me
                </Button> */}
              </div>
            </div>
            <FilterGrid>
              <div>
                <FieldLabel>Empreendimento</FieldLabel>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Selecione o empreendimento"
                  value={local}
                  onChange={(v) => {
                    if (v === undefined) {
                      setSorteio(null);
                      setVagas(null);
                      setResultado(null);
                      setLocal(null);
                    }
                    setLocal(v);
                  }}
                  allowClear
                  size="large"
                >
                  {empreendimentos!?.map((l: any) => (
                    <Option key={l?.id} value={l?.id}>
                      <EnvironmentOutlined
                        style={{ marginRight: 8, color: C.orange }}
                      />
                      {l!?.nome}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="btn-group">
                <Button
                  size="medium"
                  icon={<ClearOutlined />}
                  onClick={() => {
                    setSorteio(null);
                    setVagas(null);
                    setResultado(null);
                    setLocal(null);
                  }}
                  style={{ flex: 1, maxHeight: "40px" }}
                >
                  Limpar
                </Button>
                <Button
                  size="medium"
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={async () => {
                    enviarDados();
                  }}
                  style={{
                    flex: 1,
                    background: C.navy,
                    borderColor: C.navy,
                    maxHeight: "40px",
                  }}
                >
                  Consultar
                </Button>
              </div>
            </FilterGrid>
          </FilterCard>
        </FilterWrap>

        <ResultsSection>
          <>
            <ResultsMeta>
              <ResultsTitle>
                Resultado da Hierarquização — Empreendimento&nbsp;·&nbsp;
                {
                  empreendimentos!?.filter(
                    (empreendimento: any) =>
                      empreendimento?.id === sorteio?.idEmpreendimento
                  )[0]?.nome
                }
              </ResultsTitle>
              <ResultsDate>
                <TrophyOutlined />
                Realizado em{" "}
                {resultado ? formatDate(resultado?.dataHora) : "--/--/----"}
                &nbsp;·&nbsp;
                {totalSorteados} sorteado{totalSorteados !== 1 ? "s" : ""}
              </ResultsDate>
            </ResultsMeta>

            {loading ? (
              <>Carregando...</>
            ) : (
              <>
                {" "}
                {cotasToShow?.map((cotaKey, i) => (
                  <CotaSection
                    key={cotaKey}
                    cotaKey={cotaKey}
                    data={vagas[cotaKey]}
                    blockDelay={i * 30}
                  />
                ))}
              </>
            )}
          </>
        </ResultsSection>

        {/* add modal cadastro user */}
        <Modal
          title={
            <span style={{ fontFamily: "'Sora',sans-serif" }}>
              Cadastro Beneficiário
            </span>
          }
          open={registerModal}
          onCancel={() => setOpenRegisterModal(false)}
          footer={null}
          closeIcon={true}
          width="75%"
        >
          <Divider />

          <WrapperSteps style={{ marginTop: "20px" }}>
            <div style={{ marginTop: "10px" }}>
              <Steps
                current={current}
                style={{ marginBottom: 32 }}
                items={steps.map((item) => ({ title: item.title }))}
              />
            </div>

            <Form layout="vertical" form={form}>
              {steps[current].content}
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    gap: 8,
                    marginLeft: "auto",
                  }}
                >
                  {current > 0 && <Button onClick={prev}>Voltar</Button>}

                  {current < steps.length - 1 && (
                    <Button type="primary" onClick={next}>
                      Próximo
                    </Button>
                  )}

                  {current === steps.length - 1 && (
                    <Button type="primary" onClick={handleSubmit}>
                      Cadastrar
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </WrapperSteps>
        </Modal>

        {/* add atualização de  cadastro user */}
        <Modal
          title={
            <span style={{ fontFamily: "'Sora',sans-serif" }}>
              Atualização Beneficiário
            </span>
          }
          open={updateModal}
          onCancel={() => setOpenUpdateModal(false)}
          footer={null}
          closeIcon={true}
          width="75%"
        >
          <Divider />

          <Input.Search
            placeholder="Informe o CPF do beneficiário"
            enterButton
            onSearch={handleSearch}
            // style={{ width: 400 }}
          />

          {userId && (
            <>
              <WrapperSteps style={{ marginTop: "20px" }}>
                <div style={{ marginTop: "10px" }}>
                  <Steps
                    current={current}
                    style={{ marginBottom: 32 }}
                    items={steps.map((item) => ({ title: item.title }))}
                  />
                </div>

                <Form layout="vertical" form={form}>
                  {steps[current].content}
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        marginTop: 24,
                        display: "flex",
                        gap: 8,
                        marginLeft: "auto",
                      }}
                    >
                      {current > 0 && <Button onClick={prev}>Voltar</Button>}

                      {current < steps.length - 1 && (
                        <Button type="primary" onClick={next}>
                          Próximo
                        </Button>
                      )}

                      {current === steps.length - 1 && (
                        <Button type="primary" onClick={handleSubmitPatch}>
                          Atualizar
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              </WrapperSteps>
            </>
          )}
        </Modal>
      </Page>
    </ConfigProvider>
  );
}
