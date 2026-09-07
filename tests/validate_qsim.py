from pathlib import Path
import base64
import gzip
import json
import re

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app"


def read(name: str) -> str:
    p = APP / name
    assert p.exists(), f"arquivo ausente: {p}"
    return p.read_text(encoding="utf-8")


def load_public_dataset():
    html = read("index.html")
    m = re.search(r'const P="([A-Za-z0-9+/=]+)"', html)
    assert m, "base compactada P não localizada em app/index.html"
    raw = gzip.decompress(base64.b64decode(m.group(1))).decode("utf-8")
    return json.loads(raw)


def test_recovery_base_present():
    html = read("index.html")
    m = re.search(r'const P="([A-Za-z0-9+/=]+)"', html)
    assert m, "base compactada P não localizada em app/index.html"
    assert len(m.group(1)) > 1000, "base compactada parece vazia/truncada"


def test_public_dataset_is_anonymized():
    data = load_public_dataset()
    assert data, "dataset público vazio"
    for item in data:
        assert re.fullmatch(r"Cliente \d{3}", item.get("c", "")), f"cliente não anonimizado: {item.get('c')!r}"
        assert re.fullmatch(r"PROJ-\d{3}(?:-[A-Za-z0-9]+)?", item.get("i", "")), f"identificador de projeto não anonimizado: {item.get('i')!r}"
        for doc in item.get("d", []):
            assert any(prefix in doc for prefix in (
                "Proposta histórica", "Relatório histórico", "Resposta técnica histórica",
                "Planilha técnica histórica", "Apresentação histórica", "Documento histórico",
            )), f"referência documental não anonimizada: {doc!r}"


def test_legacy_recovery_payload_removed():
    legacy = APP / "data"
    if legacy.exists():
        files = list(legacy.glob("qsim-v6-recovery.enc.part*"))
        assert not files, f"payloads legados ainda publicados: {files}"


def test_final_modules_present():
    html = read("final.html")
    required = [
        'id="dash"', 'id="projects"', 'id="quality"', 'id="knowledge"',
        'id="search"', 'id="documents"', 'id="governance"',
        'function similarity', 'function renderKnowledge', 'function renderQuality',
        'function renderSearch',
    ]
    missing = [x for x in required if x not in html]
    assert not missing, f"módulos ausentes em final.html: {missing}"


def test_technical_tools_present():
    html = read("tools.html")
    required = [
        "function calcFlow", "function calcYplus", "function calcCFL",
        "function calcCoef", "function calcGCI", "function calcThermal",
        "function calcUnits", "Grid Convergence Index", "CFL",
    ]
    missing = [x for x in required if x not in html]
    assert not missing, f"ferramentas técnicas ausentes: {missing}"
    assert "Cf = 0,026 Re^(-1/7)" in html
    assert "1,25" in html, "fator de segurança GCI não documentado na interface"
    assert "Nenhum dado digitado é enviado para servidor" in html


def test_material_properties_module_present():
    html = read("materials.html")
    required = [
        "Módulo de Young", "Módulo de cisalhamento", "Módulo volumétrico",
        "Coeficiente de expansão térmica", "Condutividade térmica",
        "Calor específico", "Difusividade térmica", "Tenacidade à fratura",
        "Resistividade elétrica", "Condutividade elétrica",
    ]
    missing = [x for x in required if x not in html]
    assert not missing, f"propriedades de materiais ausentes: {missing}"


def test_advanced_tools_present():
    html = read("advanced.html")
    required = [
        "Inflation Layer", "Darcy-Weisbach", "Propriedades do ar",
        "Strouhal", "Números adimensionais térmicos",
        "Gerador de condições de contorno", "function calcInflation",
        "function calcDarcy", "function calcAir", "function calcStrouhal",
        "function calcThermalDim", "function genBC",
    ]
    missing = [x for x in required if x not in html]
    assert not missing, f"ferramentas avançadas ausentes: {missing}"


def test_public_shell_integrates_tools():
    shell = (ROOT / "index.html").read_text(encoding="utf-8")
    for path in ("app/final.html", "app/tools.html", "app/materials.html", "app/advanced.html"):
        assert path in shell, f"módulo não integrado ao shell: {path}"
    assert ("Ferramentas Técnicas" in shell) or ("Ferramentas CAE/CFD" in shell)
    assert "Propriedades de Materiais" in shell
    assert "Ferramentas Avançadas" in shell


def test_no_old_local_dependency():
    for name in ("final.html", "knowledge.html", "tools.html", "materials.html", "advanced.html"):
        html = read(name)
        assert "W:\\Douglas\\PLATAFORMA_QUALIDADE" not in html
        assert "Propostas_Relatorio" not in html


def test_recovery_disclaimer_present():
    html = read("final.html").lower()
    assert "relatórios e propostas originais não estão disponíveis" in html
    assert "ausência documental não é tratada automaticamente como não conformidade" in html


def test_recommendation_is_non_destructive():
    html = read("final.html").lower()
    assert "recomendações não alteram checklist/gates automaticamente" in html or "recomendação" in html
    assert "não recalcula conformidade sem evidência documental nova" in html


if __name__ == "__main__":
    tests = [v for k, v in globals().items() if k.startswith("test_") and callable(v)]
    for test in tests:
        test()
        print(f"OK {test.__name__}")
    print(f"{len(tests)} validações concluídas")
