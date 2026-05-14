import { useState, useMemo, useEffect } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Select, Button, Avatar, ConfigProvider } from "antd";
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
            <FilterHead>
              <SearchOutlined />
              <span>Filtrar hierarquizações realizados</span>
            </FilterHead>
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
      </Page>
    </ConfigProvider>
  );
}
