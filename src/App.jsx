import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Truck,
  Drill,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Droplet,
  Beaker,
  ShoppingCart,
  Boxes,
  Save,
  Send,
  Megaphone,
  Target,
  AlertTriangle,
  MapPin,
  Clock,
  Loader2,
  Receipt,
  RefreshCw,
  Printer,
  ChevronRight,
  Wrench,
  ClipboardList,
  Home,
  Camera,
  Fuel,
  Eye,
  EyeOff,
  MessageCircle,
  CheckCircle2,
  MessageSquare,
  Mail,
  Ruler,
  Upload,
  Wand2,
  ImageOff,
  Calendar,
  Bell,
  CalendarClock,
  Truck as TruckIcon,
  ClipboardCheck,
  Check,
  Lock,
  LogOut,
  Gauge,
  BarChart3,
  Settings,
  KeyRound,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Calculator,
  Copy,
  Download,
  ListChecks,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Fonts + base tokens                                               */
/* ------------------------------------------------------------------ */
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

    .tl-app {
      --bg-base: #12151A;
      --bg-panel: #1B1F26;
      --bg-panel-raised: #232833;
      --bg-hatch: #1E222A;
      --border: #2C313C;
      --border-soft: #23272F;
      --amber: #E8A63D;
      --rust: #D2601A;
      --rust-dim: #7A3A13;
      --danger: #C1432B;
      --success: #5E9A6F;
      --text-primary: #F3F1EA;
      --text-muted: #9198A6;
      --text-faint: #5A616F;
      font-family: 'Inter', sans-serif;
      background: var(--bg-base);
      color: var(--text-primary);
      min-height: 100vh;
      font-size: calc(16px * var(--tl-font-scale, 1));
    }
    .tl-app.tl-light {
      --bg-base: #F6F4EF;
      --bg-panel: #FFFFFF;
      --bg-panel-raised: #F1EEE6;
      --bg-hatch: #ECE8DE;
      --border: #DEDAD0;
      --border-soft: #E8E4DA;
      --amber: #C67F1E;
      --rust: #B34E12;
      --rust-dim: #EAC9A6;
      --danger: #B03A26;
      --success: #3D7A4E;
      --text-primary: #201D17;
      --text-muted: #5E594C;
      --text-faint: #8D8879;
    }
    .tl-display { font-family: 'Barlow Condensed', sans-serif; }
    .tl-mono { font-family: 'JetBrains Mono', monospace; }

    .tl-app ::selection { background: var(--amber); color: #1a1a1a; }
    .tl-app *, .tl-app *::before, .tl-app *::after { box-sizing: border-box; }

    .tl-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .tl-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .tl-scrollbar::-webkit-scrollbar-thumb { background: #333944; border-radius: 4px; }

    @keyframes tl-fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tl-fade-in { animation: tl-fade-in 0.18s ease-out; }

    .tl-focus:focus-visible {
      outline: 2px solid var(--amber);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .tl-fade-in { animation: none; }
    }

    /* Impressão: esconde tudo, exceto a área marcada como imprimível */
    @media print {
      body * { visibility: hidden; }
      .tl-print-area, .tl-print-area * { visibility: visible; }
      .tl-print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      /* Relatórios usam o tema escuro na tela; força cores claras só na impressão */
      .tl-print-area:not(#proposta-print) { background: #fff !important; color: #111 !important; }
      .tl-print-area:not(#proposta-print) * { background: transparent !important; color: #111 !important; border-color: #ccc !important; }
    }

    .tl-shell { display: flex; min-height: 100vh; }
    .tl-sidebar { width: 232px; flex-shrink: 0; }
    .tl-sidebar nav { flex-direction: column; }
    .tl-nav-btn { width: 100%; }
    .tl-main { flex: 1; }

    @media (max-width: 760px) {
      .tl-shell { flex-direction: column; }
      .tl-sidebar { width: 100%; padding: 12px !important; }
      .tl-sidebar > div:first-child { padding-bottom: 10px !important; }
      .tl-sidebar nav { flex-direction: row; overflow-x: auto; gap: 4px !important; }
      .tl-nav-btn { width: auto; }
      .tl-sidebar nav button { white-space: nowrap; flex-shrink: 0; border-left: none !important; border-bottom: 3px solid transparent; }
      .tl-sidebar > div:last-child { display: none; }
      .tl-main { padding: 18px 16px 50px !important; }
    }

    /* perforated ticket-stub edge, used on pedido badges */
    .tl-stub {
      position: relative;
      background: repeating-linear-gradient(
        90deg,
        transparent 0,
        transparent 3px,
        var(--bg-base) 3px,
        var(--bg-base) 4px
      );
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                    */
/* ------------------------------------------------------------------ */
// Sem logo fixa no código — cada cliente configura a própria em
// Configurações (campo "logoPersonalizado"). Sem isso, fica vazio.
const LOGO_DATA_URI = () => PREFS_ATUAL_REF?.logoPersonalizado || "";
const LOGO_PNG_DATA_URI = () => PREFS_ATUAL_REF?.logoPngPersonalizado || "";
const MASCOTE_BETONEIRA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAD7CAYAAACxKYsUAABVe0lEQVR42u29d3wdx3X3/Tszu3sremFvYAfYod6g3ixbcoEkxzWWLTtxHCd+EjuJnwSC49Q3T5zEcewUl9hxbAuSJatSXVCXKJBiA0mJvRMduH13Z877x94LghRJXIogxTLfjyEawAVwZ3fmt+ecOXMOYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWA4gyFzCQwnf461UHNzJwFAV1cXAUAymTxk7sXjcR75eXttLaOtnoFWBsDmMhqBMZh5BKCF0NxJzQDaAoHQJ/7rW0Rzcye1ARghOgWM+BiBMZxt86a5uVl0dXVRe3u7OtYir29qimMoNN6RqPWEiNuKI2SJMIEiAKJEkBpwNSNHxC6xzAnW2RyrvpCmLinR/cYby4eO+k6am2UgZm3aiI0RGMMZ7uo0NT0v2tvb/ZHfaGxstF03EocdrfMJFxDEXAJPk1JMJHCp1rpMK13iax0Cs80MMAOaOZAEOnQyErG2pJWSlkwIIRJENOQz95Cm9UzcoYhW+sT7N79xYXKkhdTU1GQFrpURGyMwhjOAFoHmTkJbmxr51SY0WT1LrKXM3EAkFoKwhImWCqIKaAWCAjMjmVHwlYJj24jHoohEwwiFHETCYY7EIrokGmXbtuF5Lnmej5zrke/7lM3maHAogUQihWw2B08plIQFLEuCIcEkAaKdYF7FrF4lgTcsX61avbp94JC53dwsjNgYgTGcbhx0O4aFZeHUqRWqaublJKLXk6ClrP2FMlJVAu2B3SGwVmAZAkUnMEcnsR2pxF03T+Y506tICBuxaIQikQickI1wOIxIJEyxaAS2ZcHzPHi+D8/z2fN95HIuhoYSSKXSnMlmwaz5nx7Yj23bdpKd3UVI7yH4CRAJUKgcyk1rVtm1EOHVULkn7d5XH129Y3DgEMvmMKvLYATGcGoR+X+HXY76xmunkpe7mO3onWSVNEFnK4S0AOFAKw8I1fiIjgPFJguKTSGKTyGyo1CwUBp18Ks/Ho/JFcHvYgC64BppDa0ZWmswM4hoxAcgSEBKghgxOz/93QGseDuJkOWDfRec7WEktrMeekdTcrtFOgfSPrSXghbhA6RT/wsvdX91uXz9oLi0CLMrZQTG8D66Qc2A7Fx0zU1s27cSxDUiXD4DXgJMFmDFgMh4hbI5oNIZguLTCE45wBpgBbAGQUNpRmmE8KMvV2FajUTWYwhBIyZbICRHg5nz/wIMhi0Jn/+3Hqza5iFkSzAIIAGQDP7N9rJO7tAY3AIe3Cgpsw8CChoW2Ms8DVYP5FYu/+FmIGcsGiMwhlNlsTQ3DwtLfeO1U6UQH9cU/hyYZ0o7IrVywVbUp5JZgqqWEEpmEDnlgB0PBEXlgn8BBIoRCIfSQGlE4Cdfqcb0WisQmPc40xiALQmf+9durNzqImQTAv3JB4jBgLAAGQqmszsAHtrK3P2m5oFOIeETax+s/A3wE/9fQvc9sGP16oER899YM0ZgDGMZXxkZ+Jx/3jVLHWF/Umv+lNZcQ3YUECEgPsVHxSIhqhYJRMblV7sCtB9YLCNE5ZAJdcoE5rBXFb4orGHLhjNdzD0rNB94TYhcL0FagMp1wE99d23HM/99pOthGFsscwnOnYdJU1OTbG9r8wFgwdKbzgOp/yOFuCGb8yty2Qxqx41XbvUVwq88HyI+yYKMAioL+NkROpJ3T06352TB52KV/2BQqJJo6ockai+BPvAac9fLWui+RlixnyxovP4O4fHX17S1rRsRg9Jmmowt0lyCc8FKbRFAO+/YsUMvWHr1oglT536bob+vtF44OJSM1NVN9T/ziVvpY5/8kuhINFJSlZAkFYgLeISlMroZQhQYEyGbcNuFUZTHBHyNY8ZcRp2kgvCbN9LY169gSRp9uMOCowM3zoqCyueRqGoUEJbyezfA93JzZMj61LiJdX7EnrJycHCHBzRLoNNYMsaCMRQdZwE00MqLFl1Xy5b4mrDEXdmcV+27OcyeU6c//cmP0cUXnm9NnzIOa7dn4eUOgDif/UZn+vMnPwb2Ad8HWxHQ9A/Lj9+0FJte+LF+8dW1JaVl8b8vrQnfNDPWdPeWzrbNaGqyYALARmAMo62sZgG0qaamJqsv4dzNQvwZMyb19w9i9pwZ/sebb7WaP3KLKCmJIOdq5LIZeL4C0dnoKVD+fxoql0R9w0J887P/LL7zbz/nn/6sTeVy7lWxWPSp+Uuu+cKG9meezlv2Ji4zRk84w1lFiwgWRpuqX3zdkoFU5BEI63upVHpSKOToP/zqF/R//9c/WXd9phmWbSGZyiLnerAsC0Rne8w/sGhy2QyIBL72ld+m73/3r62amkqVSqWnO47z4ILGa78EQI3wtwxGYAwH72ernjatKdyw7Lo/lo54Ket6N2SzafXRD9/Mv/r598UffPmzorqqEkPJDJgZQggIcW6tIxICzIzBRAaXXLgEP/vRP8tlSxdwIpGMCel8f8Gya1sAMJqapBEZIzCG4UAu9JylVy8qrwk/KqT190NDidiMGZP8f/qHb8m//6s/oSmTJyCRysJ1PUhp4vtSSgwmMpg8eQL+49/+lm770I06mUhoadn3NCy99psjYjFGZEwM5hwWF2aASDecd92dUoh/zeb8KkFQn/3U7eLLv/NZq6ayDIlUFkQEIcRx/OKDS6tw8Hnk90Z6VHyGRissSyKTySISjuDb93xdkCC+/9ePqtLSsm/XN17rd3Y8/Xcm8GssmHOUZgmA6xsa7IXn3fA3kuQvEkOpqskTx/k/+O7fyJZvfpVK4nEMJTMQQhQVYymktmoGfA14PsP1GMxBwpstCJYgCAH4iuH6DM/n4JwRit3MPs0WgRDIuR5IAC3f/AP60AdvEInEENuW87f1i6+/OxCXZmPyGQvmXBOXNtXQcP0UCtO/A3TTUDKpr7nqMtzzf79mTZ5Yg6FkFkJQ0e4Q50VFECMaEqiMS5RFBcIOwbEoyEEZYcn4PiPtMVIZjd6ExlBGwdcMzYQzLV4spYDn+bBtG99u+SNKpdL6uedf4lg8/o/zF123esOattfR0iLQ2mqS8YzAnBvisnTpFfN9gTbFaPDdrP+137/buuu374QlLQwmMrCs4h+6zIBtEerG24iFHVTEg58VhGHLh/lQJ6mQVMccWDhDaY39Az52dPvw/TPPZxJCwHV9RCJhtP7518T2HbvUrl17Y+Fw+D8WLvzAlWtbWwdgMn6Ni3RW09RkAW2qYfFFl3p22VOeiDdEwrb/z//vL62vfOlT0Eojl3OLFhdCkClLQqA0KjF/soPymDzEovHybpCvAV8VPvJfUwfdo7KYQMPUEC6aG8aUGjtwmejMcpmkFEhnspg4oQbfbv26DIccpZkXacf9VwCMlhYzB43AnMX3q73dn7/kiptEqPZhDWdSRWWF/rd/+Wvrxusuw2Aikw/kFhdrCdwnAUEHrRE3H08Z+Tqig0Ix/P9HfBTQDLgeozQisGCqg1hIQOkzz5KxpEQimcVF5y3C7/3ub8tkIqGlsH5r3uLrPhy4SC1m3RiBOetMFwuAnr/kyltlqPpeIagiZU9TCz/wZ+KCxoXoHyreJRopLO8SnhM0N4gCC0dzYBkJOjOnmJQC6ayLT33io7ji8os4lUqzbYu/mLb41nK0AACbrWsjMGdTzKXdb1h0+Q3SKf8V2ItzxUItG35H+qIErHJFB3KlOLKwjCUjf70QZ17At4DvKzi2hbs+e6cMObZm0JK4zH4Gra26ufl2s3aMwJw9MZcFSy+5mCKVPwc4hIpFWs77goCwQdrLnx8abdETLCnel8V+pgqMlBLJdBZXXHoebrzhKpFOpVgIfP38828en2+TYqwYIzBnMC0tAu3t/qJFFy9lu/LXBFGF0tlazP2cAAlAq6JWryCCfB+PA5ypblLh2rmejy9+4ZNUUhJjZkxMK/U5AAy0GIExAnOmwoTWVl0/7fzxyq78JcnIeB2bqsW8zwsIB9BeUYWfRJFBX8PRLT/XV6ibPgUfuPE6pNJpFgKfnTv3kpLDOkwajMCcOfMauIeaASlqav5ThsvmsF2u5LzPC9glQX2TIt0iIy5jIPWaYUnCB2+5Vti2BQB1dix6EwBuamoyuWRGYM4smpubBdCqNyy7rlU4pbco5fpi9qckwjVBhbYiXX8jLmNnxaSzLubOnYmLLmj005mctCznRrRAtF95pUm6MwJzJtEi2traVP3Cyz4Gu/RPlZ/Rou4Oi8rnAn6q6Hq4h7YJeZ8tgDO8bhMRwfN8VJTGsGTRfKmUD63V1QuWX11j8mKMwJxh96NVL1x4WZ2IVP0LEQmacBVo/OV5cSkyO5dw0reij9fFOONvjBDwFOPSSy8QlRVlWmmeJlg2mClrBOaMoampSaC5Wfp29NtC2hN0ZKIS028TQf+h4gXj9KpMd2hm8JksMLmch6WL6lFdXQnP96E1XR58t9VMXiMwp79r1N7e7jds7r7NCpffoZiUqPuYhHSCNhzHIRqnk7wofTZttARiOW3K5KDlLdNFw98wGIE5nd18oJVnLbmsBlb8H1jlBE1oIiqbk+9JdGbdJubgFDaDh09gaz4oNmdy6FlKgYsvaiStNADdEPSxNQJjBOY0Jtg1AtsU+TPpxKZzZIoSk28U0O57E5f30UViALYFDKYZmZwejgVFHIHSqAVBgGI+I0UmqGEMNMyfA80KECIy57xbqk5Dw/G0wezhnwauUVtbq16woGkenPgnte9pUXcjwSkBvNR7Exjm90VkmAHHBnqGFDbv8eCp2PDb2Lo/g3U7knjg1QOoiDv49qdmwpIEzWfeynRCTpCdrDkcValJAHpg+lwbC+b0pJUBMDvOl4Wwqrl0NlPVYgEv/Z5do1NdH5fzraEdi9A7pNGx2UXaDdwkzYAlCT95eg8++Q9r8cTKXizv6MGe3hwcSxxWxOoMsGJ0UMc3EglDaQ4ry5qYN0ONBWME5oiLg97HhygB4LkLz5sLK36X1orFpGtk0Lz9xNyUUykuUgJCAJv35fDyhiEMJfuwp3s3UlkPggiOLXDe7FLEIxLlMRt9CQ9vvjOUt27OnHVJFFhc4XCIyspKwMwWSNYCQLPREiMw7xIWbpZEQR4Y33vqizrnYy+wnNqvC0ERLp/PVD4f0LkTWnjMDD3GlkFQFpOHF1qh2JRtAamsxlvbXKzaOoT+gV1wc31IpZNYt2MoqIrnMxZNL0Hd+AhSWQXHEnisowdan4GBC2YIISGlFewkERm3yAjMkZ5GYKI2xS0tgghMt7ed4thjkLE7d/EN0xm4kYUFMe5yQDhj4uNozSfsfjAO1uF1bAuOLcEMeL6CUgzXJ2za7eGVDRns7vXhWDYsaYERlIZ4/M0eAEDGVZgxPoKldaVIuwq2RVi3PYmd3RnYFp1ZLU8IYK1Zq6D5IyvtGRk5OudkkJcZhI5GC+6Ez8FadSPfems/XO9nRI89lw+PnvQp39zcSW1tgEXqJhmunKjsSiXK50qozJhtSyvNEILwXo4kEREsCmqiZHIeDnSn0DuUQt9QFpmcB0sKuCoKj2MQgmAJBmBDyjA8LwEpCWu2J7GrJ4tx5Q6EELh4fhkefqMbREBvwsPza/tx1w2TkXW9oGPB6T5v8gqjmaGUClw8SaZfkrFgRopLYLFAT/wLVIZ+gLC4DWH52whZj/Krt1xGADOf9LMl1NbWpurr6x1YzsfZS0HULAXsaBBFHEO01lCai7YSCn2NfKWwry+J19bvwtNvbsXzb23Hio17sW1/P7oG0tjTk0DvwAEofwhSUN7SIdh2BICALSkvIn2IRSyksz6uXFiJqlIbWgPZnMZrGweR8zSEoEMUPejLdBqeYMo/fYJrqgFAi7wF02a0xAhM4A61am6/dQo0fwYZXyPtexhyXUgZAdEfBK88NXU+yIkuJit6ubZLgKplEso9KdvLzAyVF5qC63RkwQlWUG8ih8df34JnOrahc0cPugfT0NpHxLERsh1IQbAtCSEEstlBaO0jaDDJsO0oiAQEAZmcwqsbB+H5wd+eWBHCspml8BQjGpZYuWUI2/alEXaC4uA6/76kIMRCEkGA7PRSGCLA8zykMxkIEi5DBH5gW72JxZzzFkxDZ7B6HT8MwAJDgyAgIKC1AqHk1IRfgkpoJKtvg0qDSuo0haqDIwEnMQxUCP4qXRCcYOH7edFJZjXe3JzF6m0e0i4D0LAtAceSiEarEY2NRzw+EY5TAh08wcGs4PvZfNlODSIL0gpDa0Y0JPHWlgS27E0j4ggwgJuWVcH1NSKOwLYDGazZnoAlCGFbIBa2ELIF+hMelq/sRX/Sgy3ptNrKJgJ830c6lYGQlHHBW07lQ8nEYE6vJw6h5Z7hFXs7OnHvvffK2/8RW3/5R//zhigL3YreLGAJICThpf1fAy3innsg0HJSm2sJgFnLj1wppQSXzgJk6LjKMYxRLApA3prJtxzpGfKR8SQcKwLfyyLv+cC2o5AyAoARDpfB81LgYUEUhyzAkB1D0k0iZEts2Z/B+p1JzJ0cg+drLJlZiokVIQxlfFhS4Lk1/fjIJeOwqzuLtTtSeHpVL17fNIB9/S5++n8W4JrFlUjn1GnlJu070F14EAxu7Hhi3yEhGsM5IjDNLNFGCq0Hb3wbgLa8t3zvvRM+j44FfbDkDRBiADn3x9FLn/534DdobT3pnfv04tn/O8lTM2eyVQmKT6XTYX4SAbbMd3O0IhBiEMyA1gqum0IkEghMYL0EwmRZIVhWGMw67yYB0gpDCAsMhiWBZ1b34ebza6A0Y3J1CBfPL0PbS10oj0m8sL4fX/nBRqzcMoSt+zPBOSZBSKR9PLWqF5fXl0OcJnY2EUFpxprV61lIQQRsGRG6MgJzjghMsFjbSE37zHNhtsUEKC+iELIFkQ0AlvbJ+UiVW12a+l7zvDUPD2VDuZ+8eenOqZ/uaZSkhC9Onk0ucmkrN/6iodyKb3xQZnbVwilhik5AcO7o/d9JCbJyNSw7DCILzMEmie9n4XsZeH4arpsAs4YQEuFwOYhkfn0FH0JYsKwIPDcBx5J4af0ABpIeSiIWohELF8wtw4OvdkEIQiqr8MsX9g9nAteUOZhSE8FVi8px03nV8BRDnkaOPDOwbv0mCBJgYL2RkHNPYBggTPn0M59msj4HTzWRjB4yUC0cTK5KQGvg3vXzQYIwY0JX8LRmgjiZ6TChKJzEFuj4JFjpXUBsChCqAryhogtKnXR9BoMgYNtRZLMDIBLw/SwSiT1gBJYKEYFZI5XqguOkEYlUQQgRWDJkIRyKQPlJgIG+pIeXOgfwkYtrkc0pXDKvHOMrQ9jTmwMRUFPmYOnMEjTOLMXlDRVYOrMEjkVQGsj5+rSpbyOEQDaXxa7d+1lIAcB+Jh9UIxODOfsFhoAWAt/DUz777L8KO/a7xID2PIbKsqBC2QACM0EBADGFLBAYUB4YfIqyMtUgKNNNICaEq3H65bMyAAHbjiGbGzzkCguSIApi4kEmK5DLDUJrD7HYOAgS8JVCWSwKN2fB9RSyrsYzq/vQfPk4JDIKcydHsaSuBBMrHXzkknE4b1Yp6sZHUF7iQPkaGU/Dy+WzHk+TS6O0RjwSwhPPvMr9AwNSEPqFtNYE3zUFp85+gWm+V6DtdjXtM1f8IYXKfle7CcVgkIDM+RZllQUCEJY+HMsHMw3HDIaXz0kvYxssXNIuyEsAygOFqoIuAaehyEhpQ0oHWrkACIIsxErGQUoHyssile6B1i6IJDwvjVSqCyXxcQAIsXAIVB7Bzq4EpCC8vTuFvT05VJTYyLga//j5uYiGBMK2ABEh4yoMJj0IgeFe2TiNAhtaBfk6q9ds0INDSVleVvJGqjdnAryjWX1nxShaWKDtdjXjzlfHMcmvsZ/VgZlPMuPZaBy/F9+48CX84fmvoL66G1n/fdRVEiA/A6FdQISAUGWQXHdalbkMDmgJYcG2wsPbxAwFggCYYNkRxOMTIKUzHI/x/RSSqQPQWkEzcPG8MggRnKbuTXrY159DyCKwZkRDAsxAKqeRzPjQOnidOA3bQAb5PRYGEym8vXkLS8sCCazYvHl5Lt+2xAjMuRCD8cOpRdIunazdpAKRzPkSf3rxS/jdxlfh2D7AwB95Dv7qpavwX6uXIWx7eUvmFE5WEoDOQLALDpWCQpX5/JfT0+sM8g8T+YWm4blJhCOVYFYQwkIsNh7J1H74XhYkBJRy4XpJSBlFxlXDpWkKDeB4eNHmn3CE0763LDMjHg3htRUb+ZVXOqxo2Ekplx8FgNraWiMuZ70Fg3uC5cBiDmvNBFDGs3DTzM34g4tehCM1tG9BKwsRx8P/bXoaF03ahZTrQJzyw7AUtHxlHyALJJ38A/B0fHJr2HYEQsjh7F/PzwwfCwjcKAex2DhEIpWIxWpRUjIJkXApegf68fSqblhSIJ3TmFoTxpyJUWRdDTrD+jUREVxP4dnnX2bX81gQdaxdufx1tAQHVo2MnPUCkzfHrHAMYBKkkVMWPjRrA1goKCUhiCGI4Xs2wqEsmqbuwPtz0j6/uArFsIlwOh8nLmw5D1uJfhZKZYd3dpg1pHAQjVYj5JRCCAvKT+NA7z5kXYWBpI+aMhtfu20awo48IyvYSSmRSKXx8GNPUSQcJq34JwDYxHbPNYFxSpJU2OplQsTy3uUcEzG0FojaHiTxKXeRAokJEtVABIY8za8qw7ZjIDAsK4SQUwp613Y6g1nnPwApHQgh4foaVy6qxI//YAEuqy9HOqdwpjWbVEojErLw2GPPcF/vAEigOySch4Pvmq3pc8pFCjtxdpwYtNawpMLr+6YE1e2JoZmgmaAYEEJj5f7xcPOWzalesEGKfeBmkDi9BSYIcIYRL5mEeHw8orEaCGEf9XwQEYPIQmm8Gv/yxXr87GsNuHBuKdKuPuPEhZlhWxK9/UO478HHNIPIktYPOzoe6UVLi4AJ7p5bFgwgEI5UgEQEUZnFz9YtxivbZsGKZCBsD8L24MRSuH/NMjy1bRZijgf9PhjsRDI4c6QV2M+c9kFO5JPugsxePeq6YhDKSspw0bwKhGxCInPmWS5AUJYhHLbx2BPP6jVrN4hIyDnAWf8/AHCL0Y7ivIqzazgaQjiIx8cjm+1FJpfD5x/7ED7VsAqXTN4FXwu075iBX25sQNYXsKWC1nRK1nfhYCFYQwsHLEMgnQFyg0Co4qSfpD7x96+P8/WMVE5BaQEpzsgmJbBtC719Q/jZ/9yPSDhCzPzjtWue2tbc3CxbW1tNcPfcExgArCGEjWhsPELhLDI5F99bMwE/3hAki6U8G2HLR2ks6NJXqIh/8q0WBO6YsMHwwGQD7iDIGwQgAfbOus46IxPmzjR8xSiL2PjJ/9zHm7fsoFg82p1y9XcQFAvTRjrOVYEZPtga5HCUxiMgACofzI1T8L2sx5AUNASzT0GqVNZj5FwNIS3Ydhi+DINVDvASyHcjg+nddWosk0IBcz5K1TytNaIhB+s6N+OHP/xfHY1GpWD87dY1T3WhpUWgtdUIzLkrMIdOpqAu0sFppDh4Oi2ZEcHtV5RhSrUNppN7RoABsGa8tTWDe18cwp4eG1a4ApxygGwXQCYZ9NQ9f2S+K4CElPyu2BAzw8r3YfmX7/1I9Q8mZEks+hrn/H8HWgRazc6REZgjWjWBoZBxGdcvK8HXbquClT+xe6q45YISLK0L41ttGby9fRxsAji1D6SyMC2qTvYUyF9fN4lc1kIiwUi5RxAYzYiEQ2j75aP8zPMviVgsNuh77u+vX/NMCnjK7BwZgTl6DMT1GdNrHdx9UyVIEDK5U7uBk3OBSVUWvnRzKf5szWT4e31QZi+Q6QYiNYD2jJt0ssRF5aA3/RAY2oofbJT4WRjHTPrbt+8AwqEQWHMIxOMBoLm5mdraTHnv4+Gcemz6Crh4fgTlMQHXC7oRFhqInYoPIYGMC8wcBzQ0zENOVkN4CXB6LyBsgM3D8eQ4qAC0Bx7aDGT2gVUGybSLdCaH1FE+xk0YT04o5DNzmMj6vDExjQVThJMEVJdZ71dveBAADYIjGJW1U+GHxwG5TeD+TlDVUpyxWy6n+51nDdhxUHkDOHMAF1x8KSZPngjf945azIqIkEwkrCeffIqTQ4krF513XX1bW9u65uZmac4fGQvmmIv8WOtYaz2iRWr+GcgM1vqYry9YKcOvP4Y1km8pAFFeD0ACg5sAd/CUFvw+t4wYDcgwqHQGfC+Hvv4+RKJhOI5zxI9QKATLsjB+wgSqr5+vQaJUgz4FAG2mPYkRmPdKkLkpEAoFSpHN5EAAIhFCKCyGW3UMz1tmRKICjkPwfYVcNgcpgUiUYNv0rtePDAgxK1DVEsCOgTP7wf1r821jzQ7oSXGTWEPEJoOtUnTt2wPfV9CsofW7P5QKqvXlcjnUzawT0UiYte/ftWRJc03+/JExNY2LdPziEosJdK7fgvvv/RXeeO01ZNJpRGJRXHDhxfj4Jz+JmbOnIJ0K2rECgRi9+tIKPHj/fVi3Zg185aGsrALXXHcdPnrHnaiuLkUmU3j94XPeB6ITQOXzga43wF2vgWovNnP3pJitAtA5IDYJIjYeiYFeDA0lUBKP5VvA0lHnRGlpGc2cPZPfWrm6yo4mPgfg74ybZCyY40KpQFwef+RpfOlzn8EvfvYz7Nm9C/v270PXvn148bmn8JnfuhPPPf0yYjGC8hUcR+A/f/BDfOVLd+PxRx/B/v37sGf3HnTt34tf/OwnuOvTn8I7m7YgEjmKJcMaIBs07mJAhMBDW8E9KwE7YqyYk+EYawUOVcEqmYShwUH09w/AsqxjN3XLf69u5kwdi8XYzXmfXHjZByra2u7VAJsngRGY4i2Xt97qxF//5T0YHBxCWUU5AELdjKn49a/+Cy889Wv83hc/hT//029gQ+dmVNdKPPTgo/jeP30HQgiUlJRAa0bT5Rfj6cd+iVfbH8HShln4s2/8KQYHk7DsI3QnJAH4KVDFgsCKUS54z1OAlzpNugucnbEYUTYHOU+jv7cn763SMQwfAc/zMH7cODlhwnjNjHrk9E0AcXPz7ebhbASmWJFh/PpXbeg+0IVoLAZojUQyhVs/cD3Ob1yMyspy/OFXvggBhQfvfwB9PRnc/6tfQLOGbdsAGKlUCp/7zB2YPm0Kaqor8Rff/Bo6VryO9mdfgOMcpf0pEUACYsqNgB0HJ7eD970AyLCxYsbciCFA+0DZbEg7jO6uA8jlckW1RNEA5tXPJ8u2hFL+F9DUZBkXyQjM6A80ZjiOwIH9g1i3dg3CkQiUr6CZEQ45WL22E4lEEgDwZsdqpNM5rHlrFdatfQfbtm5FJBKFUgpaM2zHwesrVg27Qy+98gYcx8ErL70A5R/tSUlBbKBsLqh6GcAM3tcOZA8EAV+TNDq2bhL7EPFpiJZW4cC+/XBdF2KUtpFEBOX7mDBxgqitrWGtdNOCVORSHN4z13BEzu0gLwcB2FwujaHBAUgZdCjUmhGJhPHCS6/jU3d9FQ31c/HwY08jm8sikUggmRxEMpFAOBIZ3qaOx6L40U/vxYGubpSVluKBh56AEwqht7f32PlzDAA+xJQbofrXAdkD0FvuhZj/JZiA75jd6Pxsj0F1vc46m2TlZcVA/wCi0Wg+zYCO+SCyHQfz5s/nvXv2CWL9VQDt+YZr5vIaC+boZjMzEApFUFJWdsiOAjMjFArhpVfewHe//2N0d/fAtm2UlpYiFi9FrKQEWh3adVAKgV//Zjl++N+/gut5kESoqKg4dnoLUdA2NjIeYvqtYBkG968B734ckJG8gW44kbgLSALCgd75KPTbP4IQQgCEffv2FeUiFayYyZMnUU1tDXKed93i829eArTq5uZmEzAzAnN0XJdRO64cDQsWIpvJHGIyMweWTHlZCUKhELKZNBYtWYKGhtmYMaMOmWz6XSZ2PBZDWWkJLCnh+T4uuuTSInorC0BlQOMugxh3McCA3vMEuO8twIqZeMyJiIsVBvwM9MZ/19j5EIgEsVava6UHDuw/gGL9UKUUovE4zaib4VvSjivlf9pcYCMwoz6ZmBlSEj52x52oqq5BOp2GZdkQQuSfbkHd3GQyifETJuGDt30ENTVRfPSOO0FE8H0flmUd8nohBPr7+7Fk2TJcc921cN1jZ/YenMUuaMbHQKXTAS8J/c7PmIe2A1bkNO6ddJoKS94lwuBmqNX/4KNvnWASinO934hbJTeTwI5EIolkIqHlKHEYZgaJoKTH9BnTRSjkeEqrzyy64IMzgmBvi4nFGIE5ygUQAuk0Y/GS+fhmSwtKS8vQ19eLTDoNz3WRyWbQ19uLqqpq/MVffgv1DTPR3aPwwdtuwZe/+ofQSmFgoB+5XBau6yKVSqCvrxcLFizEn7d+C6VlMfg+jxpMDOItChAhiNmfAUUmAd4Q6c7vMlJ7ACtqRKZYcZFhgAR412Os1n9PCb/fYlZ7kN7/4fWrnv/7115r67Ok7Mxls+jp6WVpH6WIORc2AhwQCG+//Y5+9plnha+ULaQIK0+FTaDs2JhMXgBCENJpxk23XI8pU6fi/nvbsOWdtzGYGEI4FMKixUvw0TvuwLz5M/OZuQK+B3zhS5/HvPr5ePiBB7F1y2YAQGVlFRYva8Ttd96BmtpK5HLFiMsIvdc5UGwiaO7nMnrtdxJSZ2r9df+irIVflYhOAnyTJ3PMWIsVAxKbwdsfYBraTJYdkyo79EKY01/sWPPyxubmP4zU15d6Dy1/481UOv3xnp4eMXPWzEMCvQWxkTIoTrVr1y6sW7MOu3btFtAaQoj7Qrbzt6veeGxDc3OzbG5uwPr1z1n33HOloven2ZYRmDNDZDQaFs3DwsV/jldfXgkn5GDuvLmIxWwoBaTT+hCxyGY1rmi6FJdfcSkGB5JYt3YdqmtqsXhpHVJJIJs9yjGBY1syDO0RSmfkMPm6r+vtD/6xDNkNas0/+XL+5y2UzQVU2jw4R5oZBXdIpcA7HgT2PQsvlyGtVTcPbf/7dza8/A+FV7e1fScDAFNnXbDcccJ/2d/XF81msyzyN0prHbi8UqK3uxtrVq/B25ve5kwmnXSc8MvpbLp1z+Y3Xjv4+9pUoUZMayvQ0tIiWk1JTSMwR4vJaK3xQvtr+KOvfgXT6+rw5d//A1zedCmIACnFIVvOliVABKTTWTz2yCP49+99F5UVVfin7/87Jk0Z/56rLzADpDIRseDuVfzmXzfzuKW/kbaardb/qxIzPipowpUEzgXnmc5ZXclXixKhQGR6VoD3PgE1sI1zHmjiuAp3Qf2sp+Y3LMym0r/7Dc1ayhFbcorZuvcXv1BdXV3IpNOIl5RAa41QOITBgUFs6NyAdWvXIplI8tQp0/SsubPXLFqy6DkBuiCZTF2lwcIioTQxEbPra73fdt1H/uRPvjhoROYcF5hjpqVogfETJqKmthZvdbyJr33ly7juxptw64c/jEVLlsFxrOFfkkym8fILz+LB+x/AK6+8DOW5WLy0ERWVJdDq6JGWYuK9DKG5b2N8/Y4dr8wun3lViMP/KZ2Sm9TWezWl9kLM/ChBhvPdFPncEhbmfJyFwAObQHufgOrfgFwuh5KSErr5hvNxwUUXynAk+lsAfosOv+fMsCwb69eswauvvYZ0OkNV1dVIJBLoXN+JNW+tRndXN6bNmIaLL7mIpk6dhpLSkkulEJdOmDAB4XDokPNlQhBcz8Oe3XtWtf7df3y15Rt3v8jMZNylc01gCOhJqOFFfriFQUTwPMbsudPxgx/9GD/47nfx1PLHce/Pf45nnnwCU6ZOxczZsxGNxNDf34u3N23C/r37MDg0gLq6mfjYHXfi05+7C6GQDd9/9+9nBHWBPcUYTCpIcWyxEwhrAPTO6uf2NDXxh7qHrv5/MlL7+7z/BejMDuaaW8kOnweSFpR2821C6CzUFD5UWCCA5Hbw3mfAvW8hk0kiFArjgsYFuPaaJkyvq4Pyfam10kda5IXA7bz5c+TLL7+C7du2I5vNYMUbK7B71x5UVlbgA7fchJKyUrhuDt3dXXL//n3sK6XTySEsXbYEgDwoW0TsWBbPmzd36dat2/+n5R/+/QYi2tjCLFqJtBGYc+TBZwng1Q1pfOSSMsTDNFw283AVymQYEyeOR+tf/xVu/uCtWP7oI3jpxRfw9qZN2NDZCR0E+mDbDqbX1eHqa67FjTffhPkNs5HLAZ7H+S3wQ3+z0oxYlLByi4v1O7MIOwJ69OnHjY0/sNvbv+gBz351wdIrVnOo6q/9we3jZP/3eVfoEtp10x2YMnkCcq5CNudCSnFWCI1SGpoZ0XgIwo6ABYMHNwJdr4J718DNJKEh0DBvJq6+6lI0LGgAM5BJpwvjF0cTLCkVJk6aiGgsinVr1+LNFStgWRauuuoKXH3t1aiqqsTTTz2DbM6FEAQhBBFIDgwOIZdz330SmwgWtDtt2tSpyXTyT5qb770L99zD57olc+4IDADbImzdl8OPnujH799agXiE4Kl3uyxENOziXH3NBbjk0gvQ3d2LHdu2Ye/evcik0ygrK8fkqVMxZeoUVFeXADgYBJb2u8VFEODYhH19Cv/1eB8yOUbIoaLcpY5b7lbo+CIBLbRuVeuPLrv6xtcisYnL9x4YmPL2m8v5E599mT79idvxgQ9cjQm1VcjkfHieFwSkT3JLlrF+CBT6FgFASTwMArB3fzeGdnZAbGwHUpuRTichpYUpk8fj6isvwpJlyxCOhJHNZPMuiyhCvBSqqqowedIkbNu2HQsXLcANN1yHmbNmwrZt9PT0DLs/BbEmACIv3kcScKXZIlJcEotfW1+/d0Jra+vuvMgZgTlznR4AnW2EIrZVmIFISODxjiH0DHn44EWlmFhpw5JHV6X9fQpCSNihKsyor0Jdw8HvMQM5BWzf64GZIaTA0VL7cx7j7T0u2l4awM4uryhxYe0H4wrGx2gBmjubZXNzy+ZBd9v+3t6+KY8+upx37dhBrX/9/9D2wMP42Ic/gA998HqMq66A6zN834fn+RBCvIcdrVPj/mit8w8AC5a0YNlBMP2lVzrw5so1ePLpdmzd0QUigZywUT+vDueftxSLlyxEPF6CXC6HTDpTdDoAEUEphVgsio989Db0D/SjsXEZLMtCLpeD0uo4UgsOGQsRERGoRkk/ZkK8Z6zAtIimpudFe3u7OtRG2V7UUzJkE17flMaa7VmUx+Sojdk5/4N8RHVDUe6Ir4HeIR+agbBN0EU800hYHPz1g60y2tradEnJ9GjjFZfaF150AWbPnonXX1+BV196BW+/vRWt3/5H/PrBx9B0xSX4yG03Y8L4GpSVROD6GtlsDkGm8fsbqynULNY66P8cj4YAAEPJDHp6evH4E8/huedfweat27Fz525EIhFU1kzErFlTcfml52PW7DmIxWLIZrPIZrMgouMWhEIW9py5syGlRDqdgVK5oi2gIh57hjNUYAho1e3tI0yF++5UwO0A7eDiJjgQDQfxj+5B/5TYr5R30QgoSlwCgWEGiHEvaxAYrd9iAJgyZZYCiDPpDEpLS3DDDdfhwgvPx6uvvIY33+jAuvUbsWHjZvz0f9pwxWUX4frrrsDiRfWYOX1y3prS0DooM6G1htIMrcWY70YdrHGrAUGQUg67F44dCPvAUAqvvb4S+/YfwAsvvo7X31iJRDIF13URCoWwdOlizJw1E0uWLMTMmXWAsOB7LlKp1IjjGe/xnhAhl82BUUiGpHNrR84IzLukgQDi+qXX3AjQl0GoDL4uQSql1Nb7JtHsTxReN8rkP7joT2WMgYvTIkB7IbX+X/+zYfHlg9x4g8SyaxkgYtb6wccesG7/xB1zMH0qPM8nZg/xeBy3fPBmXHDB+di4aRNWvPEmtm/dgUceewq/eXg5FiyYjzmzZmD27DrcdMPVGD++BrZloSQWPjgZpA6OI7AGAmk7GMM5+B8csu07wrIbXpwcvCocDiEUshAKBV9KpXPwfR/pdBYvvfI63lixGrt27cH6DW+jq6sHtm2hpCSOysoKLFjYgIWLFmDatGmorq6C7/twXQ+APzZWxrCIE8iYHEZgggNlpOcvueFaIn5YSmnxyDVJIYBzhUle1IxhHB5+yysAHcvWHbGI6OTZw0QQEv5CtkKAONi7Ojh4JwOrAAzKe/1aa6RSaVRUVuDSyy7FBRecj107d2HFmx3YumUrtm/fibfeWotYLIYf//RXqKmuwsIF83DxhctQWVWN8dVxDKpaiFAZ2ANYMJTSUFqD8zGS4Ybx+ZaIUgiQEMH2uCAIEhCS8i0Tc9ixczf69iTQP5jBrl278dIrK7B5y3YMJhJIpzJIJBLDwdYlSxaidlwtZs2aiQULGlBWXgbbtuF5HlKp1IjAKr3L3TrcKjmSSzbaawznvMAETcdJqC8JYVlK+S4zy2Eh0B6E1kTv6QBn0NYCwgZkocOizv/LhxkXNFzqEqwA5RYehWM+Yq19rX0v30D5oMCIIMIsDl9tIl9DFl7QUGz6jOmYPWc2ent7sXv3HuzauQsbN27Cls1bsXPnbmzfvgv3//pRkJCora5A7YSpSOaqILSFUDiEkpI4qirLESuJwrZthBwH4XAIkXAYnu9jcHAIqWQayXQamWQW6XQGyVQKnucho1P4vyv3YLCvG739A/A9H6GQA9t2IKVANBpFfcM8zJo1C5OnTMKkSRNRXV0NrTU8z4NSCl5+HEeyVgpiJ6XMly092KPqSIIihAAJglbB72fmMbOC3hWTA0gpaVTsjIzBMCbnjXKLqLCq6T12RcxvBQkHsEJArg+c2Q4kdwDJneDMAbCXAGkXgATbUYhQFRCbBCqpA6Ljgci44O+rzEmI8JEgoiNlBB4zrlDA8zy4rot4PI5FixaioaEe11x7NTKZDFatfAur31qD3bt3w/d8pNJZvLNxLWzhgwjIkoBvSSRtO3/o7+BCFyKIVXieD99X8H0fvlLwPR+e58L3FUASiVAc0VgM06dNRTweR01NDSZPmYzJUyahtrYG0WgU0WgUJAhuLoirFILQx3KDmBmWZSEUCmFwcBB79+zFrt17sHvXbvR09yCZTCLnepBSIBIOo6KyAuPHj8O06dNQW1ODmtoaCEHI5Le1x9qiUVpbSvpGYHC25MEUHvAqW/wCZx24HtIB0nugu14F960FBrcEv4fk8ELmEVEHXRAlAIhOBFU0gGrOB1UuzJsd7tgIDevjG89RxIaI4Hs+tNZwHAd9ff1YteotbNr4Nnbu2DmcLyOlgGVFofPdOBQYihmZLIMLFh4UwuEwLNvKW1IhOPEQYo4Dx7YRCodQWlKK0rJSlJbGUVZWgngsjvKKctTW1iAUCg1bGYUAcCaTOcTKGC1oLKVEOBxG14ED6FixChs2bsTWrduQzWaHg76HCAYDnC+DCjBqa2sxd94cLF68CPUL6iGI4LqucZ2MwBRhjWR68sf2R9t35qCIU64PetcT4AMvApnuwM2RYcCOHYzHHCVAAgDIdoF37QQfeAlUXg8x7VagbA6CIIY+AXEgQOXAuR5ASJxInlahKl9vXx+eefo5vLmiA319fRBCIBQKDRfdOjxWUXjnB6vxUT4B0UPVuCrccMP1mFE3A0r5IBKQUkJKMaL1ahAnKnRKDIK76UMW8fFsLweF2ENIJJNY/vgTeO3VN9Dd3Q0iQjgcHq6tO0pcC319fXj+uRew4o03MWv2TNxww/WYM3c2PM87eidOwzkuMAxA2ODMPiCxDSiZDqjcEeIi+cisFQH3rgRv/h9wclcQe7FjBy2HUTPgCmdQLMApBdgH93RAD3QCUz4AMe1Dwe9U7vHHZpgBaYEHO4MeSUfoLqCZ4ebcwwLSRw5sRiJhrOx4C/ff/yAO7D8A27YRi8WGLYLjFStmxq6du/G/P/8Frrv+Olx7/dUAA77vobDNm06nD6mvUrAq3mPyWjCOcBgbN2xEW9uvsWvnLliWhWg0ekjspZhLa1kWHMeGUhrr13Vi8zub0XRlE27+wE2wbQuu60JC5o8+8WGzp2AJHWvTgKFZ53ylTXUwnIkV7QgK70qX5WBB5/qg97+Q33U5wu0nAQgLetfj0Gu/A07tDSrFkZUXFn38ysYquIxWBKwVeGsb9IbvA24CkCEcX9HufNEklYXe88yRb5gQ8F0Pu3bthq/8d1kew4FgIWDbNh5/7An88L9+jN6eHkSjEViWHHZP3iuFxLT72u7Hj3/430imkhAkoJUefo9B3EacUK5KIFKBVfTiCy/j+9//T+zetQeRSASWZb2ncTBzfgcOCIfDYAYef+wJ/OiHP8HgwBDC4TCUrxAOh1BeUQHmQwu7V1VVwLKOXAFPCNJSWnpwYHDDlu09XQBwzz33nNOJNfKMkhYAtRPqFkhpX8JaHeYLceBOJLaDIrWgsjmAchlEOnCb8gWFtvwCvPXeYCFLewwLahcEzAESW4GBDaCK+YBTDmiPj+q28XCYRwMSkGHoLf8LHHgtL1B8xEWSTqUwadJkjBtXw0Sk83nqDICD4DfjV7+8D8sffxKWZUFKOaZJZIGAWdi2bTu2bduGefPnIR6PQymlhSBNBD6RDwBMgkgIQQ8/9AgeeOAhIH8KeqxcmcL1CIUc7N61G5vefht1dTNQWVUJZq3Hjx+vq6qreeLEiTxh0gSePn06T5s6hYUgBo94vwALQSwti7u7+2THyo7v/+I/vvVkS0uLddVVV2kjMGeQwFSOr1tLzE1CyMkAiISgg8jgnvetI3LKSJTNJJJOsD8pbPD2+8DbHwDsKA5LFxtbf02GgPR+YGgLUHMehF1CgA6SRQ77IJJEVoiEDAvAJ976S8LuJ4ikEwxp5PCCcy4kpUXJVIr6evuosrKa4iVxEYnGhBBCSGkLyxJ44P7f4Kknn0EsFsXJylBlBhzHwf59+7Fn9x4sWboEsVichLCEtCwh5Ql8WJawLYuWL38SDz/0KEKOAyHESRoHwwk56Ovtw9at29GwsB7lFZVkSUtUVFaK8vJyUVleIUrLSoWUlhBSCmnZw+/Vsmzheb7Yu/eAaH/u+dcefnj511MDe1JXXXXVOZ8WTGfg++VZF9xYGvb5RmY1m4g0H9KIXELrHEizprmfniRrL1uGcMV43v3kJP32D0Mg6ySKy8h3KgA/A9ReyKL+y0MECgGaAMEjGqczAzmC7GFvcLPedt8q3vX4IDklYhRHCpaQSCWTeur06bErr75yaXlFeZVWvgyHov7Kjo4FL734Uom0rOKqW42BNZPNZjG/fr5/7XXXrlVae8yQRO/tj2sNhMIhd+P6DXOfe+65qnxmH52KceRyOcyYWcfX33DdaiLpMWuRz2nOv+aIN1tnspnkxvUb7/vpf/zNjwDkTPTlzBQYvBd1WHDDt27nnhd/DObISU2/fbctoyU0cem8B8SF/993OLMzRCLMRDL//n2w5jRyetuaH8zqGou/OXXuxZeEnPBvQo5ddTxZzSc8VCJWvlKZXPbrOza+/E8n+gsnTj9vbrwk/pTtOJPzZsspiRcSQSvFws3m/n7Lxhe/carmqBGY0+59txCaO4/6/pu6ugi4ErnaIXvo7ZUPSyd6jfJ9RVScWzgyn0JrPfz5kTJFj2lskBBQ2UHqX3fRuh29G4/2wuZmlm1ow8iT08XQDKCiokJce+21+h/b2pzklv5XhOUsUb6ri93CGqOxMglBrDnLlmhsvunCjccb5LznnnsIAJ5/HqJ76JVHbNu+wfdcBaLjvmesgxDdexpH8DsYwI3rVz751BVXtFjPP3+POvr7BgH3CAC6tbWVjbic+QIzKoXCy/WN135cCud/le8pIojRxlyYkL7vQ/kKjKCFrOd7UL6ClBZsy4KQositUdbScoSv1PIFM5ff0tX1PNXWXnnID7bV38M4gSLRTU1NVnt7u1/feP3vSSG+GwgpFT9WL8jERWGs+ZwQKSQsOz/Woo6AsxbSEspX93aueuqO4PxY63EsthYCWvXCxhtuBeFBHURzRTHCMnzPlILOt/1Vvg/f9yGlPK5ANzMradlSK/+Z6pKJt7S3T3dHGYcRlHNNYAoLr2fIfoOEXMLBChGjTdRCPkdd3QwsWboYkyZPQijkQCuN3r4+rF+3HuvWdiKdSsMJOcU+GTl/tS9f3/HUK4WFNFahAwC8eHFTmSecF4SUC1j7erTmSUH94SCdvm5mHZYsWYyJkybCcWxopdHT04u1a9diQ+dGpFIZhIoba3AKkjlD4KZ1q55+s7m5WQbdD4ufj/OXXvuSJa2LtfZ5NCusUDxKa8b0GdOweMkiTJs6Nbg3mtE/0I/OdRuwbt16DA0NIRQKFXfPmBVJCaXUDRtWPf3sGN+zc4aztWSmAKC7E84VRLSUg63oUZ/mruehqrISH7r1FixdtmS4JWwho20mM847rxF79+7FQ795FGtWrylywjILaQut1ecBvNzc3Cna2sZqqC0AWlmRfYmU1kKtvdHFRQR1UMaNH4fbbvsgFi5aCGkFeStBUJgwc9ZMnH/Bedi1cxd+8+DD6OzcgHA4PNoWMTGzb9l21Pe8OwC8eRzOngTa1MKl112hCUuZ1aglNwoiWV5ejg988Gacd94yOI4DKURwvCG/e9bYuAz79+/Dww89hlUr34LjFCGWBCKQEER3AXgGaDVq8R44K1sENjU1yR07duiaiTP/TAq5VGvNdIxsr8JEnTB+HL74O3ejYcF8eJ4/fKJ35L9aa1RUVGDJkkVIpTLYumUrLGtUnWYETddLxk1r+NXzTz6QCNyH9jEwrdsBADUT6u4hQQuYj22ZkiC4WRfTpk3FF3/nbsyZMxuu6x51rJVVlVi6bAkGBgawfdt2WPmTy8cIkgaWIuvS6LiFv3jl2V9nUERd2ubmBtHZ2ck1E2f8jrTsK5XS/rHiZYWKdNXV1fjC3Z/D0mVLhl2kw8fh+wplZeVYumwJMpkMtmwu5p5RXjAxYdy06T/t2rMtCVOr7j096c86t6+9vd2ffFFzhDQaMUpEf7g+azSGT37qE5g8eRKSydTw9wqZqCMP0uVyOQgh8LHmD2NBQwOy2dwo2apErBUT0XSVyy4LRPD5sbr2PGvWjSEGXcGMUWsTK1+hrKwUn/z0JzBuXM0htVaONlbLkrjz47djztw5cHPuaJm5krXWJOWCEuHOOmhlHfuetbW1qQmNt0SZxUWBdcE02j0LhRx84hN3YOasmUgkEke9Z0IEBxq11vjoxz6CpcuWDB+OHCUWAyJUal9enldB0+T+XBeY5vwkqMoMzAV4mg5SvcUxrRfXwxVXXobZc2YhlUpBymMbdkII+L4PJ+Tg5ltuRDweg1LqWAuPmOFLy5FCcMNBu+OE3SMBAE6ZXgxw1WhmvxACruvimuuuwdRpU5BOZ4oaq+f6CIdDuOWDH4AdKiaTlpmIoMldFnw+mnvRQgBQTZnxAJZoNfo9830fF150IeoX1CORSBQxjkCUhBS46eYbUFZWBuWPds9YSWkJMJ8PAI1btxqBOdcFpquriwDAE/5UEqLyWM52wTWqqCzHsmVLD7b6KObCCYFsJouZs2Zi9uyZ8P1R27hS/ljC7MCzaVcnLqadhXoSs4kociwvpDDW2nG1WLhoAbQqvnK+kAK5nIsZdTMwa2Yw1lGsGAoqPNCCg8Hf0VHM1VLKMgRNY476B5RSiEQiuOTSi4/7nuWyOUydOhUNC+qRyWZGszwZRCCmGQDQUVdngrznusAkk8l8xy27WkobzPBHm6w1NTWYMHEiXNc9roN5hVKVc+bOHXWSE5iCfAyaiINtAU/Ipy+IKTFPClJFjl4jgvJuwpTJk1FTUw3X9Y5rrMFJZIl58+cWIzAFq2Ha8YxHazEZRMeUo4J7NH78ONTW1sA/thVyVKGZPn16EQF6JtYaLLgaTU0Wgt0wE4c5lwUmHo/nT83rkmJ/prKq8oS6IdbWVo/+szRcMbtk1qwbx2T3riCmTFRCgo7UWeWwBcwoLStDJBp5DwcGGZYlUV1TXcSuGSFfpqrseP6CBVE23NT+mOPQ+ap0xz99CwJVXVVZ9MFJ0ojO9coiRi6MwIx49hSf/WlbJ7beZf7ni9iuBsBWtnpgTK87sR69AGz+NI+0xAmkhRGkPJ63zsd1YTXp4l7PgLTe+wYoM0NaEqM/E4YniQynBuXhXzac0y6SSBc72QaHhooUiCP/fGIocUiBpaMsiuDRTCI1zvP8sRhrwVoDOJ3f8aDR3ms6lYavjt+tKLiDyUTyWBs8hy5OouTx/RGRKiZiQ4IwNDj0nu+XkAJDieSo7tXB1izIDpQjezzxJMNZbsEocH9g/vKomaC9Pb0YHByEPE6Tu1B8etvWbaOa2oVjh6S5t6Ojwx/LsRKoJ1hsx1YN23bQdaAL/f39sKR13AvU931s374Dlj2a9ZAPLzEOHOcF3T+aWVHoJLB3z15kM5lCmZ/jiyVJiT279xSxVU1MQWLPwI729hMrkGwE5uygbjjSz/u08rMkjl7UlvMFjLq6urBxwyaEI8XHJgriMjAwiA0bNxURDyBNJMCErQC4paXlhJuit7dfqQN3ENu01l5eYPhocYtQyMGOHTuxc/tO2I5ddCWHwqIeGhzC+nWdw9XkRvVSwZuOx60g5n26UOT3GNdGCIHBwSGsWbMWIScEpdRx3DOJvr5+bMrfs9EzeglEvBcAGhsbLWPBnOMC09ZWHwR5M+IdEO8OTOBjb1X7vsIL7S8ikRiClHJ0ayR/OjccDuOF9hewb+++ItLPOehVC9oAAM8/PxaJdsEBPM46q4k4UYzXo5TCM888O/z0Hm2BFcbqOA6ee+559PX1jZpzEhgwRAA6gi+MlmgX5MlELe7SWr1DJOhY96zwvtuffxGDg0NFB2uDAugRvP7aCmzbtj1fMvNYW/uQWikmwtpDXVLDOewiterm5ma5ceMT+5jpbSLBx9pd0VojHA7jnXe24DcPPgzLsoaf0EeqdVuYyPF4DG+u6MAzTz9XjLhoQUIqpXq04NWB9VE7FpOVAaCz87H9zNgYFEY6+hvh/CnjjRs24dGHH4PjBD2PlFLHHGssHsNrr7+B5597oZhzPAwSQvteL4ToLHIcuqUFYsWKZ3qFpDeElGAmdax7FgqFsGvXbtx/3wNBoN62jzkOZkY8HsfaNWvw+GPLixElJoC0VlnK50W2t7ebPJjj5Kw8i9TZ0CDQ2YnqSbNKCbgFOHYKPTPDti1s2bIVg4ODqJs5A6WlpcOTuTARCz15iICXXnoF9/7yPuRyuVHLADBDC8sipfn1hTPLv9PZ2UzAv43laWrUTqwrEdK6kYuo/ialxObNW5BKpjCjrg6lpSXvHqsVjBVgvND+EtruvR/KV0Wk10NZliW0Vo90rqz4CdCJ4vKWg/NjtRNnlRLzbSMiyXQsF3Xn9p3o7u7GzJl1KCsvC4qPH/GeCbzxxpv4+f/8AtlsdnQrLKhvAwZWr1/59F/BFJEyAnNQYToZAMrHzd4hWd0FokgxsQDLsrB1yzZs3LgJrDVsx0E0FkU0EgERYWBwEO9segcPPfQInn7yGSilYFlWEf14KOiwrtTftj/7yJvNzbWiM/8eT5wWAtp5/KQZXVrhsxAULmasBZF5e9Pb0HkXKBqNIRIJLtXgwCA2btyEh37zCJ55+nkgH4cpovdQ0MYa9Hfd+x5e3djYaO/bt2/UIMmOHdsZaKVJ42bvVVB3kpBlw0e7R7lnO7bvROf6Tiit4dg2IpEIotHgng0NJbD5nc149LHHsfyx5fA8v8i6MMxSWIJZ/1X3vq0rUMSBTcMR5sPZO7QWAbTq+qXX/71lyT/2fU9REbkxhfM6yleoqa1GWXl5YE4rhWQyia4D3XBdF+FIePhJOuqTkARprbapdHrxpk2vJMZ6pPmaK9yw7LrvScv6ku8VP9ZcLgetNWpra1BWVgbbcaB8H8lkCl1dXXA9D5FwsWNlLYQUWqn1YRG+oKPjkcxIV67oe7bsmm9LaX9TK7+oWryFs0me56G6phoV5eVw8jV8Uuk0uvZ3IZvL5i0ZKmocJCSx1jtZ2hd1rnhsv7Fg3hvWWTuy5k5CG8hS/H1F3meEENUcFIY5dkFtrWHbNhzHQX//ALq7e/ITMkgys237uDJhmVkLQRKC/i4vLhLAmDblqq+vZwBaCXwPnv9xIlFazNO/0E6WiNDX14+uru4gnwcEIQUc20E0Yh1H1i/l47vibzo6HkkXBOM44mcMgBxt/7On1W+TFBOYRx9HwV2ybRuDA4Po7ekdFhEpJWzbRjQaPY4GbaQFCYtZ/1vnisf2H2fRLMNZ7yLl3aSWlhZx770/6q8ZP0MJYd2oNat8MhoVIQzDk7PwUfDbi80fYYZvWballGofchJfH9p9lx6bGjCH0t7ezkCL6Nn7owO1E+qksKxrmFXRNXmPNlYGH9dYpbQkK/XYxz50yZ+1t7cTcPxB0ebmZvnssw8lqyfMGpBC3Kq11vlaPqfkngGspbSkVv5KPxL9vd5dd/qdnf9mLBfjIh3T7OaGpdf8Slh2c75e7SkQVtZEUjD0PgJdva7jyY156+lk7URQS0sLPfLIIzLNlffZ0vqQUp4arbrdGKGIhGTmbSBx3fqO5VtPoMRkQUx4wdJr/1NY9l3K933Qybe2A2tTCGbuZ4WrO1c/9dZJvmdnPedAfYugqr1V6t+tlHrTCtJQ3ZM8VRWREAxOA/jsKRCX4ThHR0eHT9L9ovK99UJYEgzv5AspSQanNPzPrO9YviUozPSe69dy4TqFRPj3feU/LyzL4lMyDgEAOSL6XCAuzdKIixGY0R6IDIBWt7cPsM2/pbV6WwjLQVDG4WRNVAkiTdD/Z33HU082NTVZp2KitgadCahzRft+reUdWus9wpI2mNVJHKsAhA+tf2fDymdfBJolxiRe0UIdHY+kmf3PsvZXS8uy8/eMT9Y4iEhopb+5ruPJB5ubgxrBRiKMi3Q8YqpnNV41M6StnwhLXqaV4nx387FwIxgMJaS0NOtuBn+5s+OptvfHxA4WR/2SG+sh/J9KaTdq5et8iq0Ym7GyFlJKZt7Pmu9ev+qphzHmAez8rlLjtVOJ8V9C2tdp5TNzYDWN3T0TFjMGWfm/v/6tZ34Ks2M0ZshzaKwMtIi+fT/pq6mc0gYpxpMQy4SQQmv2iw3+HsV3V0KQENISmvVawWhev/Kpp/PX930wsTsZLS2i+1c/7JpYO+VexTRFSLkYRMQnNlZmhhJEUlq20Fq96ZP1sQ0rn3jx5AhpOwMQ3fu2DoSm1d7neE6FlOICIcSY3DMiIaRlCa312+zn7uxc/dzD54ZVbwTmJJGfsN07ct37tj40bkLddmbMkZY9DvnjvwBrMPQxOswGVk/QLpUAoiBzlVNa6+/75N61YeWzW9DUZGHHjvfPxG5vZ6BZHjjwWKZ7/9ZfV4+v2wfwfMuyq8GFLNnjGysRkZSW0OABrfW/ZIm/sLnjyZ1NTU3WjpM3VgYghnbv9rr3b3msZlzdJiaea0lrwnHds+A1h9wzZs5o1j9E1v1s57r2TjQ3S3R2mpiLcZHGbNy8aNF1tS7xbwmBLwkh5hZqTecr2xe2N4dzMYhEYY4CrKG1GiKin0Pzj9atevrNkab96TbWhRc0Tda+83Fm/qIQYubIsTKGjzHlx0qHtmJlhmbVD5L/DV//d36H5VSOdXgc8+ZdUyXD8nYm/h0haGGhiWVBC999zyg4oE0E1hqaVYpI/q+G/uGGjqdePw3vmRGYs4GRCVSTL7ooUuLHLiUtPkqMZSCMA1DJ4JggIZgZYGQBDECgm5nfJsJyFt4jnSva9+d/oURbmz4d/feRY21svCWaVrkmQfgwE5YQYxwIlWCOkhgeawbgASbqBuuNIPF4hEKPdHQ80jPi9536sTYfDCJPa2oKl6TsC1nTx8A4D4TxYK4CIUYQIpAZnWOiAQJ1M+vNAnjCBh5aterpvSOExfSTNgJz0hBobqbDdz7qG6+dqrWcJMBlgjjCIA+KkkxeV2k4ve21117LjLyOzc3N4vTP9mwRQCcdvjsyd/EN0y3iiUwoFcQRELtQSEKKA4me3PYdO9qzh8yZ5maB93esR7xnDeddP0VpPUkwl7OWYSFYQVOSSRyAm9nZ2dmePPPumeFsElsRbE+OLrzB1nOLwJkp0gS0nA1jPZfumbFgzq7r0kLNzZ1UaA0CALW1tRwUtDqrTOqzZazn0j0zGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg+Esx5TMPPXX1ZRtNPfGXGzDKbv+BDQTmgHka8k2JpMEAJlMhgDAdV0CZsHzgs+VypFSHmntka7yqVIpUkqR1mWklE9cqkmrGAGA1uqQe8xaU/DvUb7O+ohfD74XyfcZygwvRMp3Bxn+nILP3/V1IY/4dZH/upAppiHBUlosxCBLKblPSha9Fgths5Q2SxliALDtCAOb4TgOA0AkEmEA6IjHg99dW8toA4C2Qh1eIxxGYE7pOMdiwongo5Ewq0ZM8zLkukmhazzyc3FRoXzyvJxQyhNKRQTHFLHWFGVNSoUERzRp5QtmTcxhYq2JWROYKYSg8yI7mpid/MLn4e9zvjMjEZ38hTPa3xjuEnnyOGS8REwkuDB2IpfJDUQrhxHfF4KJskwkWEhLU0awlDmdLnwvJVnKjJbS1rYd0v3SYiuU1KLbZseJ6x12hLG5WwMdjKAlrj5N56ERmNN7/C0EdBKauqgxmaTBwUGRKiuTbjIk49mU9DxHqnBOhlVIKMeVSllSK1+EQkyFxXVQBPTw4h+2BJiHReLgmnW5mEVcsAbe/fV3v55PwUI/pTfmOMZ4uNV1NPE74n0YFqq85ZUXqEPuExHncsRCWlpKX0nXUVmZ0zIbUrbtqmQ4piIV2g/39OiysjLdEY8z2msZMN0M6Ax8r8XeLNHY2Ch7euIym+2Xfnlc+JmEFYuGhZ/LWGEVEkpJqUNKOMoX2rak1kqwVqLop3cRYnAsS+NsE4UzSaxGu/5HFa1RhIyE1EJILTxfudLSIie1lEplZU5boYifSme1FSnxrYGkDocrVHV1UnV0dKjjsJCOdx0YgXmPF1IAzTRr1ipr0HHsqG1buRTZniQ75LtSK0c4jhKsbaG1ClwRbYvDn0zFCITBcPxu3QiBOszSJeFpIsFCSE3C064rtZCuzlmOshV7oRh7ac/zy1zX27x5qZ+PJekzUXDOhCco1dfX2729lu3GbCuUVo5dlrG9XNRWPmzHyccmDn+aHGb6HulJZiwIw/thQY2cdyNd6SM99FyXWFrw7FDa8wYjXi4qXSfl+VVVvtfZ2emd7pYMnQZ//9AL1NIiJvzHI2EqExErrR3fJssSOdv3yWJti5HWh7E6DOeMNTTCCiLhacti39chz/LY96PC5UGd2Xf3LVm0tupR19i5ZsFMm9YUZu6LJLWIxsJWuODSjFT1kTsHxvIwnMuW0MgdxZHrQwipU1k/Gxc6TVSZ2bGjPXtOWzAVdY1lMdePIyQiyvcsEkKPdGuIiI2YGAzHFp3Ddy5ZayEt20dOZ1KOlezf2jF4rgmMNWXu0lrlqjiYiYTURkwMhrEVHdZKgIilI5O7Nq3qAuCf6vci3w9Bmzjx/ArF2SopbZXP7CSYnByDYUzXmRBSEwn2XTdaGpuuEom9mVO9zsQpHjgDQHn59ATJcEorX+qReScGg2HM0FoJrXxJMpwqL5+eGLkGz3YXCQDExInnVyjbLZGkQ3nbzuwMGQwn8gQfEfxVLHLScxJ7967ox9gcdTijBCZPs6yp6YpQPBsjnY3YlrC0VsLsIBkMR1iwx9hJEkJqz9c+i3CGk+FUd3dtBmhT77uv9j7//ZEWC82adaPT7e6JlkWdsO+RZXmupSxhaSWlyYExGMskyIURUinpa9+3Hd+y2R9Mu9kaZ1J68+bl7uFrCud6HsyxaGxstPfuhR2JwM5YsO0sbFdox7aEpZQnD7sLR8ziNRm8htPJ+jh8Hh4rmxcApLSV52vf0cL1wvAiPrxMBt7EifA6Ojq803rMp/l7O+Y5JOANu2ruJDvmJKxcKm57Ltshx5Na+YIdLRxticDdcvKnnHMHb/IRjhIYDCfF8hghHsE8DOVLT7gshNSu8DW5Qgtp6ZxrK9shLxRLeim3xO/dtMcDLvCKOI9kziKNwfss8iI2S9SvlxP6I5ZbmpR+NixLlCc8x7KU4walF5Qlbd+T7OQPQx6+m1XESWpzgvrMtyKKuS9Fnaw+7OcLp6rJ9bRn2UpKPyjx4DrKdn0/IW1thbPKGYqrfRUZH50N6jjiJWfMiepzdbLn68A8L9AEoLtbzHJdKtSB8bMpGfNyUoUrZFj5R6gDE1hEw5mT7zJ1HTo4YXNHntiHfX4u1345EXEoukbMu2rDFD4PHfzd+Rjf4a718CYDuUeoC2Npme1XmXDMF3ZIO/Gcig0Oqs2Ow6ip0WgHgCv1uVoXhs6xMY5RJbtGiVk1YnJ2QKhxHvmZjNCqnMq8nFDKJ6UiQscVad8TWoUEa01h7QsA0CFbMGvSqnDeKkQhaOL8qfBAuOwRxaoOCtV7qmB3KqrenZgPQcf/I4GbcVAYCkLgcaFgFLnEOQgG5fJV7YKkM5HzNABkhaVJCBYyp4Vla5EsVLizeNAOaSEH2IpEtDxg8+5wuc5Xtzueui2nck4agTEccs0Jzc2Eri5CMkn1h9TeBTxv0nDt3eDfg/V3y1xXDNfeZU06rkjrGBVq52rfyde+ebdZHwjYwdq70cOf+BGAOURHsxAKv3NkXV16lyWWY2QOtcjSh1gF4og7gEGJS8HCcnXhcyFSLJKSiQ7W6h10HD2yTi8AHKzVu4cBDNfq7YxEGPE4BzV6TX1eIzBn77U0k9rcM4PBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg2E0/n9O2FaYGqxLCgAAAABJRU5ErkJggg==";
const SEED_DATA = { clientes: [], producaoEsc: [], producaoPerf: [] }; // dados reais removidos por segurança — já migrados pro Firestore há muito tempo

const STORAGE_KEYS = {
  clientes: "top-locacoes:clientes",
  producaoEsc: "top-locacoes:producao-escavadeira",
  propostas: "top-locacoes:propostas",
  maquinas: "top-locacoes:maquinas",
  manutencoes: "top-locacoes:manutencoes",
  agenda: "top-locacoes:agenda",
  controleDiario: "top-locacoes:controle-diario",
  security: "top-locacoes:security",
  appAccess: "top-locacoes:app-access",
  prefs: "top-locacoes:prefs",
  financeiro: "top-locacoes:financeiro",
  operadores: "top-locacoes:operadores",
  vendedores: "top-locacoes:vendedores",
  statusClientes: "top-locacoes:status-clientes",
  despesas: "top-locacoes:despesas",
  folhaPagamento: "top-locacoes:folha-pagamento",
  funcionarios: "top-locacoes:funcionarios",
  motoristas: "top-locacoes:motoristas",
  caminhoes: "top-locacoes:caminhoes",
  empresasRetirada: "top-locacoes:empresas-retirada",
  galeriaDivulgacao: "top-locacoes:galeria-divulgacao",
  cubicagens: "top-locacoes:cubicagens",
  comprasMaterial: "top-locacoes:compras-material",
  movimentosEstoque: "top-locacoes:movimentos-estoque",
  bombaConcreto: "top-locacoes:bomba-concreto",
  cartaTraco: "top-locacoes:carta-traco",
  registrosDiesel: "top-locacoes:registros-diesel",
  mensagens: "top-locacoes:mensagens",
  usuarios: "top-locacoes:usuarios",
  logAcessos: "top-locacoes:log-acessos",
  bombas: "top-locacoes:bombas",
  agendamentos: "top-locacoes:agendamentos",
  ordensServico: "top-locacoes:ordens-servico",
  pecas: "top-locacoes:pecas",
  movimentosPecas: "top-locacoes:movimentos-pecas",
};

const FINANCEIRO_SEED = []; // dados reais removidos por segurança — já migrados pro Firestore há muito tempo

const MAQUINAS_PADRAO = [];

async function loadCollection(key) {
  // Importante: se der erro de rede/conexão aqui, a gente PRECISA que o
  // erro suba pra quem chamou — nunca devolver lista vazia nesse caso.
  // Se devolvêssemos vazio, o app pensaria "essa área realmente não tem
  // nada" e em alguns lugares reage a isso regravando dados padrão por
  // cima do que já existia — apagando tudo sem querer numa falha
  // passageira de conexão. Lista vazia só pode significar "realmente não
  // tem nada salvo ainda", nunca "não consegui checar agora".
  const result = await window.storage.get(key, true);
  return result ? JSON.parse(result.value) : [];
}

async function saveCollection(key, data) {
  try {
    const json = JSON.stringify(data);
    // O banco de dados (Firestore) recusa documentos acima de ~1MB. Como
    // agora TODO lançamento de Produção vira uma conta no Financeiro (não
    // só os pagos), esse arquivo específico pode crescer bastante — melhor
    // avisar exatamente isso do que deixar parecer "problema de internet".
    if (json.length > 900000) {
      console.error(`Coleção "${key}" está grande demais pra salvar (${(json.length / 1024).toFixed(0)} KB, limite ~900 KB).`);
      const erro = new Error("TAMANHO_EXCEDIDO");
      erro.tamanho = json.length;
      throw erro;
    }
    const result = await window.storage.set(key, json, true);
    return !!result;
  } catch (e) {
    console.error("Erro ao salvar", key, e);
    if (e.message === "TAMANHO_EXCEDIDO") throw e;
    return false;
  }
}

// Registra uma linha no histórico de acesso (login ou exclusão). Busca e
// salva direto no banco, sem depender de props — pode ser chamada de
// qualquer lugar do app (inclusive de dentro do ConfirmDelete central).
async function registrarLog(tipo, detalhe, dadosExcluidos = null) {
  try {
    const atual = await loadCollection(STORAGE_KEYS.logAcessos);
    const entrada = {
      id: uid(),
      usuario: USUARIO_ATUAL_REF?.nome || "Desconhecido",
      tipo,
      detalhe,
      dataHora: new Date().toISOString(),
      dadosExcluidos, // guarda o registro inteiro quando é uma exclusão, pra dar pra ver depois
    };
    await saveCollection(STORAGE_KEYS.logAcessos, [...atual, entrada]);
  } catch (e) {
    console.error("Falha ao registrar log", e);
  }
}

// Junta todas as coleções do sistema num único arquivo JSON e baixa —
// serve como cópia de segurança manual, feita na hora, sem depender de
// nenhuma configuração externa.
async function baixarBlob(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function coletarTudoParaBackup() {
  const chaves = Object.keys(STORAGE_KEYS);
  const dados = {};
  for (const chave of chaves) {
    dados[chave] = await loadCollection(STORAGE_KEYS[chave]);
  }
  // Nunca inclui a senha de ninguém no backup, mesmo hasheada.
  if (dados.usuarios) {
    dados.usuarios = dados.usuarios.map(({ senhaHash, ...resto }) => resto);
  }
  return dados;
}

async function baixarBackupCompleto() {
  const dados = await coletarTudoParaBackup();
  dados._geradoEm = new Date().toISOString();
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const hoje = new Date().toISOString().slice(0, 10);
  await baixarBlob(blob, `backup-rjl-mix-concreto-${hoje}.json`);
  await registrarLog("Backup", "Baixou um backup completo do sistema (JSON)");
}

// Versão em Excel do backup — cada coleção vira uma aba da planilha. Usa a
// biblioteca "xlsx" carregada só na hora (não pesa o app o tempo todo).
// No site publicado funciona de verdade; nesta pré-visualização do Claude
// a biblioteca não está instalada, então cai automaticamente pro JSON.
async function baixarBackupExcel() {
  const dados = await coletarTudoParaBackup();
  try {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    // Essas áreas sempre viram aba, mesmo vazias — pra nunca parecer que
    // "sumiram" do backup só porque não tinham nenhum lançamento na hora.
    const SEMPRE_INCLUIR = new Set(["clientes", "producaoEsc", "producaoPerf", "financeiro", "propostas"]);
    let algumaAba = false;
    for (const chave of Object.keys(dados)) {
      const linhas = dados[chave];
      if (!Array.isArray(linhas)) continue;
      if (linhas.length === 0 && !SEMPRE_INCLUIR.has(chave)) continue;
      const ws = XLSX.utils.json_to_sheet(linhas.length > 0 ? linhas : [{ aviso: "Nenhum lançamento nessa área no momento do backup" }]);
      XLSX.utils.book_append_sheet(wb, ws, chave.slice(0, 31));
      algumaAba = true;
    }
    if (!algumaAba) throw new Error("Nada pra exportar ainda");
    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const hoje = new Date().toISOString().slice(0, 10);
    await baixarBlob(blob, `backup-rjl-mix-concreto-${hoje}.xlsx`);
    await registrarLog("Backup", "Baixou um backup completo do sistema (Excel)");
    return true;
  } catch (e) {
    console.error("Backup em Excel indisponível aqui, usando JSON:", e);
    return false;
  }
}

async function savePhotoBlob(id, dataUrl) {
  try {
    const result = await window.storage.set(`foto:${id}`, dataUrl, true);
    return !!result;
  } catch (e) {
    console.error("Erro ao salvar foto", e);
    return false;
  }
}

async function loadPhotoBlob(id) {
  try {
    const result = await window.storage.get(`foto:${id}`, true);
    return result ? result.value : null;
  } catch (e) {
    return null;
  }
}

// Junta todas as fotos de um Tick num único PDF, uma por página, mantendo
// a proporção de cada imagem. Detecta JPEG/PNG pelo próprio data URL, já
// que fotos de celular podem vir nos dois formatos.

async function deletePhotoBlob(id) {
  try {
    await window.storage.delete(`foto:${id}`, true);
  } catch (e) {
    /* ignore */
  }
}

async function hashPassword(pw) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Antes, essas abas ficavam trancadas por trás de uma segunda senha de
// administrador. Agora que existe login individual (nome + senha) logo na
// entrada do sistema, esse cadeado extra virou redundante — quem entra já
// está identificado. Lista vazia = nenhuma aba exige desbloqueio extra.
// (A exclusão de itens continua exigindo permissão de administrador,
// isso é outro mecanismo, separado deste.)
const PROTECTED_TABS = [];

// Papéis de usuário e quais abas cada um enxerga no menu. Administrador
// sempre vê tudo (nem precisa estar na lista de "dashboard" abaixo — é
// tratado à parte). Os outros papéis só veem as abas listadas aqui.
const PAPEIS_USUARIO = ["Administrador", "Financeiro", "Comercial", "Operacional"];
const ABAS_POR_PAPEL = {
  Financeiro: ["dashboard", "mensagens", "financeiro", "despesas", "folhaPagamento", "relatorios", "clientes"],
  Comercial: ["dashboard", "mensagens", "clientes", "propostas", "agenda"],
  Operacional: ["dashboard", "mensagens", "agenda", "bombas", "manutencao", "abastecimento", "estoquePecas", "ordensServico"],
};
// Desativado temporariamente a pedido — o código continua todo pronto,
// é só trocar para "true" quando formos investigar o problema com calma.
const SENHA_ATIVADA = true;

// Comprime uma imagem selecionada pelo usuário para caber com folga no limite de armazenamento.
function compressImage(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Falha ao carregar imagem"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Gera o PDF da proposta como um Blob. Retorna null se a biblioteca de PDF
// não estiver disponível neste ambiente (ex.: pré-visualização dentro do
// Claude), para que quem chamar possa usar um caminho alternativo
// (imprimir/salvar manualmente). Importante: só tentamos importar a
// biblioteca no site publicado — tentar isso dentro do Claude pode travar
// o carregamento do app inteiro, então nem chegamos perto disso aqui.
// No site publicado (fora do Claude), essa função é substituída por uma
// versão completa que gera o PDF de verdade com a biblioteca jsPDF.
// Aqui dentro do Claude, ela sempre retorna null (sem gerar PDF), e quem
// chama usa "Imprimir" como alternativa — isso evita qualquer risco de
// travar o app tentando carregar uma biblioteca que não existe aqui.
async function gerarPdfProposta(proposta, cliente, total) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  try {
    doc.addImage(LOGO_PNG_DATA_URI(), "PNG", margin, y, 40, 40);
  } catch (e) {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 50, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const linhaCnpjEndereco = [PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" - ");
  doc.text(linhaCnpjEndereco, margin + 50, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`PROPOSTA Nº ${proposta.pedido || "-"}`, 555, y + 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`${proposta.tipo || "-"} - ${new Date(proposta.criadaEm).toLocaleDateString("pt-BR")}`, 555, y + 30, { align: "right" });

  y += 55;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 22;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(cliente ? cliente.nome : "-", margin + 45, y);

  doc.setFont("helvetica", "bold");
  doc.text("Contato:", 300, y);
  doc.setFont("helvetica", "normal");
  doc.text(cliente?.telefone || "-", 345, y);
  y += 16;

  doc.setFont("helvetica", "bold");
  doc.text("CPF/CNPJ:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(cliente?.cpf || "-", margin + 60, y);

  doc.setFont("helvetica", "bold");
  doc.text("Endereço:", 300, y);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(enderecoCompleto(cliente) || "-", 200), 350, y);
  y += 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Descrição", margin, y);
  doc.text("Qtd", 350, y, { align: "right" });
  doc.text("Valor unit.", 460, y, { align: "right" });
  doc.text("Subtotal", 555, y, { align: "right" });
  y += 6;
  doc.line(margin, y, 555, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  proposta.itens.forEach((it) => {
    const subtotal = (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0);
    doc.text(it.descricao || "-", margin, y);
    doc.text(String(it.qtd || 0), 350, y, { align: "right" });
    doc.text(money(it.valorUnit), 460, y, { align: "right" });
    doc.text(money(subtotal), 555, y, { align: "right" });
    y += 16;
  });

  y += 10;
  doc.line(margin, y, 555, y);
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total: ${money(total)}`, 555, y, { align: "right" });

  if (proposta.observacao) {
    y += 26;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(proposta.observacao, 515), margin, y);
    y += doc.splitTextToSize(proposta.observacao, 515).length * 11;
  }

  doc.addPage();
  let y2 = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("OBSERVAÇÕES", margin, y2);
  y2 += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const linhas = doc.splitTextToSize(proposta.descritivo !== undefined ? proposta.descritivo : DESCRITIVO_ESCAVADEIRA, 515);
  doc.text(linhas, margin, y2);

  return doc.output("blob");
}

// Versão segura do PDF do tick (mesma lógica: no site publicado essa função
// é substituída por uma versão completa com jsPDF; aqui sempre retorna null).

// Versão segura do PDF do recibo (mesma lógica: real só no site publicado).
async function gerarPdfRecibo(conta, cliente, numeroRecibo) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  try {
    doc.addImage(LOGO_PNG_DATA_URI(), "PNG", margin, y, 40, 40);
  } catch (e) {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 50, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const linhaCnpjEndereco = [PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" - ");
  doc.text(linhaCnpjEndereco, margin + 50, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`RECIBO Nº ${numeroRecibo}`, 555, y + 16, { align: "right" });
  if (conta.pedido) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Pedido nº ${conta.pedido}`, 555, y + 30, { align: "right" });
  }

  y += 55;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 30;

  const nomeCliente = cliente?.nome || "-";
  const dataPagamento = conta.dataPagamento || conta.vencimento;

  // Quando o recibo junta vários dias de produção (producaoDetalhe), o
  // valor certo a mostrar é a SOMA de tudo — não o valor de um lançamento
  // só. E o texto ganha o período (datas) trabalhado.
  const producaoDetalhe = conta.producaoDetalhe || [];
  const valorTotal = producaoDetalhe.length > 0 ? producaoDetalhe.reduce((s, r) => s + numeroSeguro(r.total), 0) : numeroSeguro(conta.valor);
  const datasOrdenadas = [...new Set(producaoDetalhe.map((r) => r.data).filter(Boolean))].sort((a, b) => dataOrdenavel(a).localeCompare(dataOrdenavel(b)));
  const periodoTexto =
    datasOrdenadas.length === 0
      ? ""
      : datasOrdenadas.length === 1
      ? `, do dia ${fmtDate(datasOrdenadas[0])}`
      : `, do dia ${fmtDate(datasOrdenadas[0])} ao dia ${fmtDate(datasOrdenadas[datasOrdenadas.length - 1])}`;
  const equipamentosTexto = [...new Set(producaoDetalhe.map((r) => r.equipamento).filter(Boolean))].join(", ");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const texto =
    `Recebemos de ${nomeCliente}${cliente?.cpf ? ` (CPF/CNPJ ${cliente.cpf})` : ""}, a quantia de ${money(valorTotal)}, ` +
    `referente a ${conta.descricao || "serviço prestado"}${equipamentosTexto ? ` (${equipamentosTexto})` : ""}` +
    `${conta.pedido ? `, pedido nº ${conta.pedido}` : ""}${periodoTexto}, ` +
    `pago em ${fmtDate(dataPagamento)}${conta.formaPagamento ? ` via ${conta.formaPagamento}` : ""}.`;
  const linhas = doc.splitTextToSize(texto, 515);
  doc.text(linhas, margin, y);
  y += linhas.length * 16 + 20;

  // Detalhamento do serviço, puxado da Produção lançada nesse pedido —
  // cada item (concreto, bomba, cargas) vira uma linha numerada própria,
  // já com a especificação do concreto (FCK/Brita/Slump).
  const itensRecibo = [];
  producaoDetalhe.forEach((r) => {
    const especConcreto = [r.fck, r.brita, r.slump ? `Slump ${r.slump}` : ""].filter(Boolean).join(" - ");
    if (numeroSeguro(r.valorDiaria) > 0) itensRecibo.push({ label: `Concreto${especConcreto ? ` (${especConcreto})` : ""} - ${fmtDate(r.data)}`, valor: numeroSeguro(r.valorDiaria) * (numeroSeguro(r.qtdDias) || 1) });
    if (numeroSeguro(r.frete) > 0) itensRecibo.push({ label: `Bomba - ${fmtDate(r.data)}`, valor: numeroSeguro(r.frete) });
    const viagensTotal = (r.viagens || []).reduce((s, v) => s + subtotalCarga(v) + (Number(v.valorBomba) || 0), 0);
    if (viagensTotal > 0) itensRecibo.push({ label: `Cargas de entrega - ${fmtDate(r.data)}`, valor: viagensTotal });
  });

  if (itensRecibo.length > 0) {
    doc.setDrawColor(200);
    doc.rect(margin, y, 515, 14, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("DETALHAMENTO DO SERVIÇO", margin + 8, y + 10);
    y += 26;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let totalItens = 0;
    itensRecibo.forEach((item, i) => {
      if (y > 770) {
        doc.addPage();
        y = margin;
      }
      doc.text(`${i + 1}. ${item.label}`, margin + 4, y);
      doc.text(money(item.valor), 555, y, { align: "right" });
      totalItens += item.valor;
      y += 17;
    });

    y += 4;
    doc.setDrawColor(180);
    doc.line(margin, y, 555, y);
    y += 16;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total", margin + 4, y);
    doc.text(money(totalItens), 555, y, { align: "right" });
    y += 20;
  }

  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text("Para maior clareza e por ser verdade, firmamos o presente recibo.", margin, y);
  doc.setTextColor(0);

  y += 90;
  doc.setDrawColor(150);
  doc.line(margin + 130, y, margin + 390, y);
  doc.setFontSize(9);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 260, y + 14, { align: "center" });

  return doc.output("blob");
}

// Versão segura do PDF da ordem de serviço (mesma lógica: real só no site publicado).

// Versão segura do PDF de relatório geral por pedido (mesma lógica: real só no site publicado).
async function gerarPdfRelatorioGeral(pedido, cliente, lancamentosEsc, propostasPedido, contasPedido, totalGeral) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  try {
    doc.addImage(LOGO_PNG_DATA_URI(), "PNG", margin, y, 40, 40);
  } catch (e) {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 50, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const linhaCnpjEndereco = [PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" - ");
  doc.text(linhaCnpjEndereco, margin + 50, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RELATÓRIO GERAL", 555, y + 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Pedido nº ${pedido}`, 555, y + 30, { align: "right" });

  y += 55;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 22;

  if (cliente) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${cliente.nome}  ·  Telefone: ${cliente.telefone || "-"}  ·  Endereço: ${cliente.endereco || "-"}`, margin, y);
    y += 22;
  }

  const secao = (titulo, itens, montarLinha, valorSubtotal, montarDetalhe) => {
    if (!itens || itens.length === 0) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(titulo, margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    itens.forEach((it) => {
      const [label, valor] = montarLinha(it);
      doc.text(label, margin, y);
      doc.text(valor, 555, y, { align: "right" });
      y += 13;
      if (montarDetalhe) {
        doc.setFontSize(8);
        doc.setTextColor(110);
        const detalhe = montarDetalhe(it);
        const linhasDetalhe = doc.splitTextToSize(detalhe, 515);
        doc.text(linhasDetalhe, margin + 6, y);
        y += linhasDetalhe.length * 10 + 4;
        doc.setFontSize(9.5);
        doc.setTextColor(0);
      }
    });
    if (valorSubtotal !== undefined) {
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal", margin, y);
      doc.text(money(valorSubtotal), 555, y, { align: "right" });
      y += 15;
    }
    y += 10;
  };

  const totalEsc = (lancamentosEsc || []).reduce((s, r) => s + numeroSeguro(r.total), 0);

  secao(
    `Produção (${(lancamentosEsc || []).length})`,
    lancamentosEsc,
    (r) => [`${fmtDate(r.data)} — ${r.equipamento || "-"}`, money(r.total)],
    totalEsc,
    (r) => {
      const viagensTotal = (r.viagens || []).reduce((s, v) => s + (Number(v.valor) || 0), 0);
      return `Diária: ${money(r.valorDiaria)} · Frete: ${money(r.frete)} · Retirada de material: ${r.retiradaMaterial ? `Sim - ${r.retiradaMaterial}` : "Não"}${(r.viagens || []).length > 0 ? ` · Viagens: ${r.viagens.length} (${money(viagensTotal)})` : ""}`;
    }
  );
  secao(
    `Propostas (${(propostasPedido || []).length})`,
    propostasPedido,
    (p) => [`${p.tipo} — ${new Date(p.criadaEm).toLocaleDateString("pt-BR")}`, money(p.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0))]
  );
  secao(
    `Financeiro (${(contasPedido || []).length})`,
    contasPedido,
    (c) => [`${c.tipo} — ${c.descricao || "-"} (${c.status})`, money(c.valor)]
  );

  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total geral: ${money(totalGeral)}`, 555, y, { align: "right" });

  return doc.output("blob");
}

// Versão segura do PDF de relatório de inadimplência por cliente (mesma lógica: real só no site publicado).
async function gerarPdfInadimplenciaCliente(cliente, itens, totalAberto) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  try {
    doc.addImage(LOGO_PNG_DATA_URI(), "PNG", margin, y, 40, 40);
  } catch (e) {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 50, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const linhaCnpjEndereco = [PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" - ");
  doc.text(linhaCnpjEndereco, margin + 50, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RELATÓRIO DE PENDÊNCIAS", 555, y + 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(cliente?.nome || "-", 555, y + 30, { align: "right" });

  y += 55;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${itens.length} lançamento(s) em aberto`, margin, y);
  doc.text(`Total: ${money(totalAberto)}`, 555, y, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Pedido / data", margin, y);
  doc.text("Situação", 555, y, { align: "right" });
  y += 6;
  doc.line(margin, y, 555, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  [...itens]
    .sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")))
    .forEach((it) => {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Pedido #${it.pedido || "-"}`, margin, y);
      doc.text(money(it.valor), 555, y, { align: "right" });
      y += 13;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(90);
      doc.text(`${fmtDate(it.data)} · ${it.origem || "-"} · ${it.descricao || "-"} · ${it.atrasado ? "ATRASADO" : "A vencer"}`, margin, y);
      doc.setTextColor(0);
      doc.setFontSize(9.5);
      y += 16;
    });

  y += 8;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total em aberto: ${money(totalAberto)}`, 555, y, { align: "right" });

  return doc.output("blob");
}

// Versão segura do PDF de relatório de estacas por pedido (mesma lógica: real só no site publicado).

// Versão segura do PDF da folha de pagamento (mesma lógica: real só no site publicado).
async function gerarPdfFolhaPagamento(mes, itens) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  const nomeMes = new Date(`${mes}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  try {
    doc.addImage(LOGO_PNG_DATA_URI(), "PNG", margin, y, 40, 40);
  } catch (e) {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 50, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const linhaCnpjEndereco = [PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" - ");
  doc.text(linhaCnpjEndereco, margin + 50, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("FOLHA DE PAGAMENTO", 555, y + 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(nomeMes, 555, y + 30, { align: "right" });

  y += 55;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 22;

  const totalGeral = itens.reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalPago = itens.filter((f) => f.status === "Pago").reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalPendente = totalGeral - totalPago;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Total da folha: ${money(totalGeral)}   ·   Já pago: ${money(totalPago)}   ·   Pendente: ${money(totalPendente)}`, margin, y);
  y += 24;

  const porFuncionario = new Map();
  itens.forEach((f) => {
    if (!porFuncionario.has(f.funcionario)) porFuncionario.set(f.funcionario, []);
    porFuncionario.get(f.funcionario).push(f);
  });
  const nomes = [...porFuncionario.keys()].sort();

  nomes.forEach((nome) => {
    if (y > 740) {
      doc.addPage();
      y = margin;
    }
    const lancamentos = porFuncionario.get(nome);
    const totalFuncionario = lancamentos.reduce((s, f) => s + valorLiquidoFolha(f), 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(nome, margin, y);
    doc.text(money(totalFuncionario), 555, y, { align: "right" });
    y += 14;

    lancamentos.forEach((f) => {
      if (y > 770) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${f.tipoPagamento} — vencimento ${fmtDate(f.vencimento)} (${f.status})`, margin + 8, y);
      doc.text(money(valorLiquidoFolha(f)), 555, y, { align: "right" });
      y += 11;

      doc.setFontSize(7.5);
      doc.setTextColor(110);
      let detalhe = `Salário: ${money(f.salarioBase)} · Vale transp.: ${money(f.valeTransporte)} · Vale alim.: ${money(f.valeAlimentacao)} · Ajuda de custo: ${money(f.ajudaCusto)}`;
      if (numeroSeguro(f.premiacao) > 0) detalhe += ` · Premiação: +${money(f.premiacao)}`;
      if (numeroSeguro(f.desconto) > 0) detalhe += ` · Desconto: -${money(f.desconto)}`;
      const linhasDetalhe = doc.splitTextToSize(detalhe, 505);
      doc.text(linhasDetalhe, margin + 8, y);
      y += linhasDetalhe.length * 9 + 6;
      doc.setFontSize(9);
      doc.setTextColor(0);
    });
    y += 6;
  });

  return doc.output("blob");
}

// Versão segura do PDF de relatório de produção por status (mesma lógica: real só no site publicado).
async function gerarPdfRelatorioProducaoFinanceiro(titulo, porStatus, totalGeral) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  try {
    doc.addImage(LOGO_PNG_DATA_URI(), "PNG", margin, y, 40, 40);
  } catch (e) {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa", margin + 50, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const linhaCnpjEndereco = [PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" - ");
  doc.text(linhaCnpjEndereco, margin + 50, y + 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RELATÓRIO", 555, y + 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(titulo, 555, y + 30, { align: "right" });

  y += 55;
  doc.setDrawColor(20);
  doc.line(margin, y, 555, y);
  y += 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Total geral: ${money(totalGeral)}`, margin, y);
  y += 22;

  porStatus.forEach((g) => {
    if (y > 750) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${g.status} (${g.itens.length})`, margin, y);
    doc.text(money(g.total), 555, y, { align: "right" });
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    g.itens.forEach((r) => {
      if (y > 780) {
        doc.addPage();
        y = margin;
      }
      doc.text(`${r.cliente || "-"} — ${fmtDate(r.data)} (${r.equipamento || "-"})`, margin, y);
      doc.text(money(r.total), 555, y, { align: "right" });
      y += 14;
    });
    y += 10;
  });

  return doc.output("blob");
}

/* ------------------------------------------------------------------ */
/*  Small utilities                                                    */
/* ------------------------------------------------------------------ */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// No computador (Windows/Mac), o menu nativo de compartilhar geralmente não
// tem o WhatsApp instalado como opção real, e só confunde. Usamos o menu
// nativo (que anexa o PDF direto) só em celular, onde o WhatsApp app existe.
const ehCelular = typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

// Alguns valores vêm de importações de planilha já formatados como texto
// (ex: "1.600,00"), o que faz Number() direto virar NaN/0. Essa função
// entende tanto números normais quanto texto no formato brasileiro.
// Converte texto de valor pra número, reconhecendo tanto o formato
// brasileiro (1.500,00 — ponto separa milhar, vírgula é decimal) quanto o
// americano (1,500.00 — o inverso), já que a planilha às vezes mistura os
// dois dependendo de como cada célula foi formatada no Excel.
const numeroSeguro = (v) => {
  if (typeof v === "number") return v;
  if (v === null || v === undefined || v === "") return 0;

  let limpo = String(v)
    .replace(/[^\d,.\-]/g, "") // tira "R$", espaços, letras etc.
    .trim();
  if (!limpo) return 0;

  const temVirgula = limpo.includes(",");
  const temPonto = limpo.includes(".");

  if (temVirgula && temPonto) {
    // Os dois aparecem — o que vier por último é o separador decimal.
    if (limpo.lastIndexOf(",") > limpo.lastIndexOf(".")) {
      limpo = limpo.replace(/\./g, "").replace(",", "."); // formato BR
    } else {
      limpo = limpo.replace(/,/g, ""); // formato US
    }
  } else if (temVirgula) {
    // Só vírgula: se sobrarem exatos 2 dígitos depois dela, é decimal
    // (ex: "1500,50"); senão é separador de milhar (ex: "1,500").
    const partes = limpo.split(",");
    const ultima = partes[partes.length - 1];
    limpo = ultima.length === 2 ? partes.slice(0, -1).join("") + "." + ultima : limpo.replace(/,/g, "");
  } else if (temPonto) {
    // Só ponto: se o último grupo tiver 3 dígitos, é separador de milhar
    // (ex: "1.500" = mil e quinhentos); senão é decimal normal (ex: "1.5").
    const partes = limpo.split(".");
    const ultima = partes[partes.length - 1];
    if (partes.length > 2 || ultima.length === 3) {
      limpo = limpo.replace(/\./g, "");
    }
  }

  const convertido = Number(limpo);
  return isNaN(convertido) ? 0 : convertido;
};

const money = (v) =>
  numeroSeguro(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const fmtDate = (iso) => {
  if (!iso) return "-";
  const normalizado = dataOrdenavel(iso);
  const d = new Date(normalizado + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
};

// Datas às vezes chegam em formato DD/MM/AAAA (de planilha importada) em vez
// de AAAA-MM-DD (o padrão do sistema) — isso bagunça qualquer ordenação por
// texto. Essa função sempre devolve AAAA-MM-DD, não importa como a data
// chegou, pra ordenar corretamente em qualquer lugar do app.
const dataOrdenavel = (valor) => {
  const s = String(valor || "").trim();
  if (!s) return "";

  // AAAA-MM-DD (já no formato certo)
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return isoMatch[0];

  // DD/MM/AAAA — ano com 4 dígitos (aceita 1 ou 2 dígitos em dia/mês)
  const brMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, d, m, y] = brMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // M/D/AA — ano com 2 dígitos (vem de outro formato de exportação da
  // planilha, nesse caso é mês/dia, não dia/mês)
  const usMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (usMatch) {
    const [, mo, d, y2] = usMatch;
    return `20${y2}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return s;
};

// Soma dias a uma data (aceita qualquer formato que dataOrdenavel entenda)
// e devolve no formato AAAA-MM-DD. Usada pra dar um prazo padrão de
// pagamento em lançamentos que não têm vencimento explícito (ex: produção,
// onde só existe a data do serviço, não uma data de cobrança).
const adicionarDias = (dataStr, dias) => {
  const iso = dataOrdenavel(dataStr);
  if (!iso || iso.length < 10) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

// Ordena uma lista de cadastros (máquinas, operadores, motoristas...) em
// ordem alfabética pelo campo "nome" — ou pelo próprio valor, se for uma
// lista de strings (como equipamentosEsc/Perf). Usada em todos os
// dropdowns e cadastros pra ficar mais fácil de achar o que procura.
const porNome = (arr) =>
  [...(arr || [])].sort((a, b) =>
    String(typeof a === "string" ? a : a?.nome || "").localeCompare(String(typeof b === "string" ? b : b?.nome || ""), "pt-BR", { sensitivity: "base" })
  );

const STATUS_STYLES = {
  Ativo: { bg: "#2B4F3A", fg: "#7BC492" },
  "EM ABERTO": { bg: "#52431D", fg: "#F0B958" },
  "CONCLUÍDO": { bg: "#2B4F3A", fg: "#7BC492" },
  Inativo: { bg: "#363D49", fg: "#AEB5C2" },
  Potencial: { bg: "#532B2B", fg: "#E88886" },
  PAGO: { bg: "#2B4F3A", fg: "#7BC492" },
  BOLETO: { bg: "#2C3F55", fg: "#8CBCE8" },
  PIX: { bg: "#3D2B54", fg: "#CBA6F2" },
  CANCELADO: { bg: "#532B2B", fg: "#E88886" },
  ATRASADO: { bg: "#532B2B", fg: "#E88886" },
};

// Lista inicial de status de cliente — depois disso, quem administra pode
// adicionar/remover pela tela de Configurações, sem precisar de mim.
const STATUS_CLIENTES_PADRAO = [
  { id: "st1", nome: "Ativo" },
  { id: "st2", nome: "EM ABERTO" },
  { id: "st3", nome: "CONCLUÍDO" },
  { id: "st4", nome: "Inativo" },
];

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#262b34", fg: "#9198A6" };
  return (
    <span
      className="tl-mono"
      style={{
        background: s.bg,
        color: s.fg,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 8px",
        borderRadius: "3px",
        whiteSpace: "nowrap",
      }}
    >
      {status || "SEM STATUS"}
    </span>
  );
}

function PedidoStub({ n }) {
  return (
    <div
      className="tl-stub tl-display"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "var(--bg-panel-raised)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--amber)",
        borderRadius: "3px",
        padding: "3px 10px 3px 8px",
        fontSize: "18px",
        fontWeight: 700,
        color: "var(--text-primary)",
        lineHeight: 1,
      }}
    >
      <span style={{ color: "var(--text-faint)", fontSize: "11px" }}>Nº</span>
      {n}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic UI atoms                                                   */
/* ------------------------------------------------------------------ */
function Field({ label, required, children, hint }) {
  return (
    <label style={{ display: "block", marginBottom: "14px" }}>
      <span
        className="tl-mono"
        style={{
          display: "block",
          fontSize: "11px",
          letterSpacing: "0.06em",
          color: "var(--text-muted)",
          marginBottom: "6px",
          textTransform: "uppercase",
        }}
      >
        {label} {required && <span style={{ color: "var(--rust)" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span
          style={{
            display: "block",
            fontSize: "11.5px",
            color: "var(--text-faint)",
            marginTop: "4px",
          }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--bg-base)",
  border: "1px solid var(--border)",
  borderRadius: "5px",
  padding: "9px 11px",
  color: "var(--text-primary)",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
};

function Input(props) {
  return <input {...props} className="tl-focus" style={{ ...inputStyle, ...(props.style || {}) }} />;
}
function Select(props) {
  return (
    <select {...props} className="tl-focus" style={{ ...inputStyle, ...(props.style || {}) }}>
      {props.children}
    </select>
  );
}
function TextArea(props) {
  return (
    <textarea
      {...props}
      className="tl-focus"
      style={{ ...inputStyle, resize: "vertical", minHeight: "70px", ...(props.style || {}) }}
    />
  );
}

function Button({ variant = "primary", size = "md", icon: Icon, children, ...rest }) {
  const variants = {
    primary: { bg: "var(--rust)", fg: "#fff", border: "var(--rust)" },
    ghost: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border)" },
    danger: { bg: "transparent", fg: "var(--danger)", border: "#4a2620" },
    subtle: { bg: "var(--bg-panel-raised)", fg: "var(--text-primary)", border: "var(--border)" },
  };
  const v = variants[variant];
  const pad = size === "sm" ? "6px 10px" : "9px 16px";
  return (
    <button
      {...rest}
      className="tl-focus"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: v.bg,
        color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: "5px",
        padding: pad,
        fontSize: size === "sm" ? "12.5px" : "13.5px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "filter 0.12s ease",
        opacity: rest.disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => !rest.disabled && (e.currentTarget.style.filter = "brightness(1.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,9,11,0.72)",
        backdropFilter: "blur(2px)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "5vh 16px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="tl-fade-in tl-scrollbar"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          width: "100%",
          maxWidth: wide ? "720px" : "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <h3 className="tl-display" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.01em" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="tl-focus"
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

// Exibe uma foto salva localmente (usado em Divulgação, Manutenção, Controle
// Diário) — componente genérico de visualização de foto, reaproveitado em
// vários lugares do sistema.
function FotoVisualGrande({ id }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let ativo = true;
    loadPhotoBlob(id).then((v) => { if (ativo) setSrc(v); });
    return () => { ativo = false; };
  }, [id]);
  if (!src) {
    return <div style={{ width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={16} style={{ color: "var(--text-faint)" }} /></div>;
  }
  return <img src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />;
}

function FotoThumb({ id, onRemove }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let ativo = true;
    loadPhotoBlob(id).then((v) => { if (ativo) setSrc(v); });
    return () => { ativo = false; };
  }, [id]);
  return (
    <div style={{ position: "relative", width: "72px", height: "72px", flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-soft)", background: "var(--bg-panel-raised)" }}>
        {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Loader2 size={14} style={{ margin: "28px auto", display: "block", color: "var(--text-faint)" }} />}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="tl-focus"
        style={{ position: "absolute", top: "-6px", right: "-6px", background: "var(--danger)", border: "none", borderRadius: "50%", width: "20px", height: "20px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

// Campo de upload de foto(s), usado em Manutenção e Controle Diário —
// tira/anexa foto e salva localmente via savePhotoBlob.
function FotosUpload({ fotos, onChange }) {
  const [enviando, setEnviando] = useState(false);
  const fileRef = React.useRef(null);

  const adicionarFotos = async (fileList) => {
    setEnviando(true);
    const novasIds = [];
    for (const file of Array.from(fileList)) {
      try {
        const dataUrl = await compressImage(file);
        const id = uid();
        const ok = await savePhotoBlob(id, dataUrl);
        if (ok) novasIds.push(id);
      } catch (e) {
        console.error("Falha ao processar foto", e);
      }
    }
    onChange([...(fotos || []), ...novasIds]);
    setEnviando(false);
  };

  const removerFoto = async (id) => {
    await deletePhotoBlob(id);
    onChange((fotos || []).filter((f) => f !== id));
  };

  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Fotos</span>
        <Button type="button" size="sm" variant="subtle" icon={Camera} disabled={enviando} onClick={() => fileRef.current?.click()}>
          {enviando ? "Enviando..." : "Tirar / adicionar foto"}
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.length && adicionarFotos(e.target.files)}
      />
      {(fotos || []).length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {fotos.map((id) => (
            <FotoThumb key={id} id={id} onRemove={() => removerFoto(id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div
      style={{
        padding: "56px 24px",
        textAlign: "center",
        color: "var(--text-faint)",
      }}
    >
      <Icon size={30} style={{ margin: "0 auto 12px", opacity: 0.6 }} />
      <p className="tl-display" style={{ fontSize: "18px", color: "var(--text-muted)", marginBottom: "4px" }}>
        {title}
      </p>
      <p style={{ fontSize: "13px" }}>{hint}</p>
    </div>
  );
}

// Guardado fora de qualquer componente para que ConfirmDelete (usado em
// todas as abas) sempre tenha acesso à senha de administrador mais atual,
// sem precisar repassar essa prop em cada uma das ~15 telas que excluem algo.
let ADMIN_HASH_REF = "";

// Guarda quem está logado agora, pra qualquer parte do app (inclusive o
// ConfirmDelete central e o registrarLog) saber sem precisar de props.
let USUARIO_ATUAL_REF = null;

// Guarda os dados da empresa (nome, CNPJ, endereço) configurados em
// Configurações, pra qualquer gerador de PDF usar sem precisar propagar
// "prefs" como prop através de vários componentes intermediários.
let PREFS_ATUAL_REF = {};

function ConfirmDelete({ label, dados, onConfirm, onCancel }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [verificando, setVerificando] = useState(false);

  // Se já existe sistema de usuários, a permissão é decidida por quem está
  // logado (ninguém digita senha de novo — já entrou com a própria). Se o
  // app ainda estiver no modelo antigo de senha única, cai nesse fallback.
  const temUsuarios = !!USUARIO_ATUAL_REF;
  const podeExcluir = temUsuarios ? !!USUARIO_ATUAL_REF?.admin : true;
  const exigirSenha = !temUsuarios && !!ADMIN_HASH_REF;

  const confirmar = async (e) => {
    e.preventDefault();
    if (!exigirSenha) {
      if (temUsuarios) await registrarLog("Exclusão", label, dados || null);
      onConfirm();
      return;
    }
    setVerificando(true);
    const hash = await hashPassword(senha);
    setVerificando(false);
    if (hash === ADMIN_HASH_REF) {
      onConfirm();
    } else {
      setErro("Senha incorreta.");
    }
  };

  if (temUsuarios && !podeExcluir) {
    return (
      <Modal title="Sem permissão" onClose={onCancel}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <Lock size={20} style={{ color: "var(--danger)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Só administradores podem excluir itens. Peça pra um administrador fazer isso, ou entre com uma conta de administrador.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onCancel}>Entendi</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Confirmar exclusão" onClose={onCancel}>
      <form onSubmit={confirmar}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <AlertTriangle size={20} style={{ color: "var(--danger)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Tem certeza que deseja excluir <strong style={{ color: "var(--text-primary)" }}>{label}</strong>? Essa ação não pode ser desfeita.
          </p>
        </div>

        {exigirSenha && (
          <Field label="Senha de administrador" hint="Necessária para confirmar qualquer exclusão">
            <Input type="password" autoFocus value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </Field>
        )}
        {erro && <p style={{ fontSize: "12.5px", color: "var(--danger)", marginTop: "-8px", marginBottom: "12px" }}>{erro}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={verificando} style={{ background: "var(--danger)", borderColor: "var(--danger)" }}>
            {verificando ? "Verificando..." : "Excluir"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function PasswordGate({ hasPassword, onClose, onSubmit, onReset }) {
  const [mode, setMode] = useState("login"); // 'login' | 'reset'
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const creating = !hasPassword || mode === "reset";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (creating) {
      if (pw.length < 4) {
        setError("Use pelo menos 4 caracteres.");
        return;
      }
      if (pw !== pw2) {
        setError("As senhas não coincidem.");
        return;
      }
    }
    setChecking(true);
    const ok = mode === "reset" ? await onReset(pw) : await onSubmit(pw);
    setChecking(false);
    if (!ok) setError("Senha incorreta.");
  };

  return (
    <Modal title={creating ? (mode === "reset" ? "Redefinir senha" : "Criar senha de acesso") : "Área protegida"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <Lock size={20} style={{ color: "var(--amber)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {mode === "reset"
              ? "Defina uma senha nova. Ela substitui a anterior para toda a equipe."
              : hasPassword
              ? "Essa área é protegida por senha. Digite a senha para continuar."
              : "Esta é a primeira vez acessando uma área protegida. Defina uma senha — ela vai valer para Clientes, Produção, Controle Diário e Configurações."}
          </p>
        </div>

        <Field label={creating ? "Nova senha" : "Senha"}>
          <Input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} required />
        </Field>
        {creating && (
          <Field label="Confirmar senha">
            <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
          </Field>
        )}

        {error && (
          <p style={{ fontSize: "12.5px", color: "var(--danger)", marginTop: "-8px", marginBottom: "14px" }}>{error}</p>
        )}

        {hasPassword && mode === "login" && (
          <button
            type="button"
            onClick={() => { setMode("reset"); setError(""); setPw(""); setPw2(""); }}
            style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: "12px", cursor: "pointer", padding: 0, marginBottom: "14px", textDecoration: "underline" }}
          >
            Esqueceu a senha? Redefinir agora
          </button>
        )}
        {mode === "reset" && (
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setPw(""); setPw2(""); }}
            style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: "12px", cursor: "pointer", padding: 0, marginBottom: "14px", textDecoration: "underline" }}
          >
            Voltar para digitar a senha
          </button>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={checking}>{creating ? "Salvar e entrar" : "Entrar"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function AppLoginGate({ onSubmit }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setChecking(true);
    const ok = await onSubmit(pw);
    setChecking(false);
    if (!ok) setError("Senha incorreta.");
  };

  return (
    <div style={{ width: "100%", maxWidth: "360px", padding: "0 20px", textAlign: "center" }}>
      <style>{`
        @keyframes tlLogoLoginPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(232,166,61,0)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 0 14px rgba(232,166,61,0.5)); }
        }
      `}</style>
      <img
        src={LOGO_DATA_URI()}
        alt="Logo"
        style={{
          width: "128px",
          height: "128px",
          borderRadius: "22px",
          margin: "0 auto 20px",
          display: "block",
          background: "#F5F2E9",
          animation: "tlLogoLoginPulse 3.5s ease-in-out infinite",
        }}
      />
      <div className="tl-display" style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
        {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
        Acesso restrito à equipe. Digite a senha do sistema.
      </p>
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <Field label="Senha de acesso">
          <Input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} required />
        </Field>
        {error && (
          <p style={{ fontSize: "12.5px", color: "var(--danger)", marginTop: "-8px", marginBottom: "14px" }}>{error}</p>
        )}
        <Button type="submit" disabled={checking} style={{ width: "100%", justifyContent: "center" }}>
          {checking ? "Verificando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

function UsuarioLoginGate({ usuarios, onLogin, onCriarPrimeiroAdmin }) {
  const semUsuarios = usuarios.length === 0;
  const [nome, setNome] = useState(semUsuarios ? "" : usuarios[0]?.nome || "");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [capsLockAtivo, setCapsLockAtivo] = useState(false);

  const detectarCapsLock = (e) => {
    if (typeof e.getModifierState === "function") {
      setCapsLockAtivo(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (semUsuarios) {
      if (!nome.trim()) {
        setError("Digite seu nome.");
        return;
      }
      if (senha.length < 4) {
        setError("Use pelo menos 4 caracteres na senha.");
        return;
      }
      if (senha !== senha2) {
        setError("As senhas não coincidem.");
        return;
      }
      setChecking(true);
      await onCriarPrimeiroAdmin(nome.trim(), senha);
      setChecking(false);
      return;
    }
    setChecking(true);
    const ok = await onLogin(nome, senha);
    setChecking(false);
    if (!ok) setError("Senha incorreta.");
  };

  return (
    <div style={{ width: "100%", maxWidth: "360px", padding: "0 20px", textAlign: "center" }}>
      <style>{`
        @keyframes tlLogoLoginPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(232,166,61,0)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 0 14px rgba(232,166,61,0.5)); }
        }
      `}</style>
      <img
        src={LOGO_DATA_URI()}
        alt="Logo"
        style={{
          width: "128px",
          height: "128px",
          borderRadius: "22px",
          margin: "0 auto 20px",
          display: "block",
          background: "#F5F2E9",
          animation: "tlLogoLoginPulse 3.5s ease-in-out infinite",
        }}
      />
      <div className="tl-display" style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
        {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
        {semUsuarios ? "Primeiro acesso — crie o usuário administrador." : "Escolha seu nome e digite sua senha."}
      </p>
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        {semUsuarios ? (
          <Field label="Seu nome">
            <Input autoFocus value={nome} onChange={(e) => setNome(e.target.value)} required />
          </Field>
        ) : (
          <Field label="Usuário">
            <Select value={nome} onChange={(e) => setNome(e.target.value)} required>
              {usuarios.map((u) => (
                <option key={u.id} value={u.nome}>{u.nome}</option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Senha">
          <div style={{ position: "relative" }}>
            <Input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyUp={detectarCapsLock}
              onKeyDown={detectarCapsLock}
              required
              autoFocus={!semUsuarios}
              style={{ paddingRight: "38px" }}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="tl-focus"
              style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: "4px" }}
              title={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        {capsLockAtivo && (
          <p style={{ fontSize: "12px", color: "var(--amber)", marginTop: "-8px", marginBottom: "12px" }}>
            ⚠️ Caps Lock está ativado — isso pode fazer sua senha ficar diferente do que você imagina.
          </p>
        )}
        {semUsuarios && (
          <Field label="Confirmar senha">
            <Input type={mostrarSenha ? "text" : "password"} value={senha2} onChange={(e) => setSenha2(e.target.value)} required />
          </Field>
        )}
        {error && (
          <p style={{ fontSize: "12.5px", color: "var(--danger)", marginTop: "-8px", marginBottom: "14px" }}>{error}</p>
        )}
        <Button type="submit" disabled={checking} style={{ width: "100%", justifyContent: "center" }}>
          {checking ? "Verificando..." : semUsuarios ? "Criar e entrar" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav shell                                                          */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "mensagens", label: "Mensagens", icon: MessageSquare },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "bombas", label: "Bombas", icon: Droplet },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "propostas", label: "Propostas", icon: FileText },
  { id: "ordensServico", label: "Ordens de Serviço", icon: ClipboardList },
  { id: "manutencao", label: "Manutenção", icon: Wrench },
  { id: "abastecimento", label: "Abastecimento", icon: Fuel },
  { id: "estoquePecas", label: "Estoque de Peças", icon: Boxes },
  { id: "financeiro", label: "Financeiro", icon: Wallet },
  { id: "despesas", label: "Despesas Fixas", icon: Home },
  { id: "folhaPagamento", label: "Folha de Pagamento", icon: UserCheck },
  { id: "relatorios", label: "Relatório Geral", icon: BarChart3 },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export default function App() {
  // Link separado pra equipe de campo: adicione ?campo=1 no fim do endereço
  // do site e compartilhe esse link com quem só precisa lançar abastecimento,
  // tick de carregamento e apontamento diário — sem ver clientes, financeiro
  // ou qualquer outra área.
  const campoMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("campo") === "1";
  const [tab, setTab] = useState(() => {
    // Lembra em qual página a pessoa estava — assim atualizar (F5) não
    // manda de volta pro Painel toda vez. Dura só enquanto a aba do
    // navegador estiver aberta (fecha e abre de novo, começa do Painel).
    try {
      const salva = sessionStorage.getItem("tl-aba-atual");
      if (salva && NAV_ITEMS.some((item) => item.id === salva)) return salva;
    } catch (e) {}
    return "dashboard";
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("tl-aba-atual", tab);
    } catch (e) {}
  }, [tab]);
  const [loading, setLoading] = useState(true);
  // Guarda a última versão confirmada de cada "gaveta" de dados (o que
  // veio do banco por último) — usado antes de salvar, pra detectar se
  // alguém mais mudou algo enquanto essa pessoa estava editando, evitando
  // que um salve por cima do outro sem perceber.
  const lastSyncedRef = useRef({});
  const persistQueueRef = useRef({});
  const [loadError, setLoadError] = useState("");
  const [clientes, setClientes] = useState([]);
  const [producaoEsc, setProducaoEsc] = useState([]);
  const producaoPerf = []; // removido nesta versão (usina de concreto não usa perfuratriz)
  const [propostas, setPropostas] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const fotos = []; // removido nesta versão
  const [agenda, setAgenda] = useState([]);
  const ticks = []; // removido nesta versão
  const [controleDiario, setControleDiario] = useState([]);
  const [financeiro, setFinanceiro] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [statusClientes, setStatusClientes] = useState([]);
  const checklists = []; // removido nesta versão
  const estacas = []; // removido nesta versão
  const [despesas, setDespesas] = useState([]);
  const [folhaPagamento, setFolhaPagamento] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [caminhoes, setCaminhoes] = useState([]);
  const [empresasRetirada, setEmpresasRetirada] = useState([]);
  const [galeriaDivulgacao, setGaleriaDivulgacao] = useState([]);
  const [cubicagens, setCubicagens] = useState([]);
  const [comprasMaterial, setComprasMaterial] = useState([]);
  const [movimentosEstoque, setMovimentosEstoque] = useState([]);
  const [bombaConcreto, setBombaConcreto] = useState([]);
  const [cartaTraco, setCartaTraco] = useState([]);
  const [registrosDiesel, setRegistrosDiesel] = useState([]);
  const [bombas, setBombas] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [ordensServico, setOrdensServico] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [movimentosPecas, setMovimentosPecas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [logAcessos, setLogAcessos] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  // Se a aba atual não é permitida pro papel desse usuário (ex: sessão
  // anterior era de outra pessoa com mais acesso), manda de volta pro
  // Painel — que todo mundo pode ver.
  useEffect(() => {
    if (!usuarioAtual || usuarioAtual.admin) return;
    const papel = usuarioAtual.papel;
    if (!papel || papel === "Administrador") return;
    const permitido = ABAS_POR_PAPEL[papel] || [];
    if (!permitido.includes(tab)) setTab("dashboard");
  }, [usuarioAtual, tab]);

  // Assim que os dados terminarem de carregar, tenta voltar sozinho pro
  // usuário que já tinha feito login antes — sem isso, atualizar a página
  // (F5) sempre voltava pra tela de login, mesmo já tendo entrado.
  useEffect(() => {
    if (loading || usuarioAtual || usuarios.length === 0) return;
    try {
      const nomeSalvo = localStorage.getItem("tl-usuario-logado");
      if (nomeSalvo) {
        const usuario = usuarios.find((u) => u.nome === nomeSalvo && u.ativo !== false);
        if (usuario) setUsuarioAtual(usuario);
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, usuarios]);
  const [security, setSecurity] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [appSecurity, setAppSecurity] = useState(null);
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [prefs, setPrefs] = useState({ theme: "dark", fontScale: 1 });
  const [saveError, setSaveError] = useState("");

  const [importBanner, setImportBanner] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  // O app carrega os dados uma vez quando a página abre. Se alguém (por
  // exemplo, um funcionário no Modo Campo) lançar algo novo depois disso,
  // essa tela não saberia sozinha — por isso, a cada 45 segundos, a gente
  // busca de novo só as coleções que mudam com mais frequência no dia a
  // dia, sem precisar recarregar a página inteira.
  const atualizarDadosRecentes = useCallback(async () => {
    try {
      const [mn, cd, ag, fn, pe] = await Promise.all([
        loadCollection(STORAGE_KEYS.manutencoes),
        loadCollection(STORAGE_KEYS.controleDiario),
        loadCollection(STORAGE_KEYS.agenda),
        loadCollection(STORAGE_KEYS.financeiro),
        loadCollection(STORAGE_KEYS.producaoEsc),
      ]);
      setManutencoes(mn);
      setControleDiario(cd);
      setAgenda(ag);
      setFinanceiro(fn);
      setProducaoEsc(pe);
    } catch (e) {
      console.error("[TopLocacoes] Falha na atualização automática", e);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    const intervalId = setInterval(atualizarDadosRecentes, 20000);
    return () => clearInterval(intervalId);
  }, [loading, atualizarDadosRecentes]);

  useEffect(() => {
    let terminou = false;
    const travouTimeout = setTimeout(() => {
      if (!terminou) setLoadError("Está demorando demais pra carregar. Provavelmente é um problema de conexão com o banco de dados — verifique sua internet e recarregue a página. Se persistir, avise o administrador.");
    }, 12000);

    (async () => {
     try {
      console.log("[TopLocacoes] App: iniciando carregamento de todas as coleções...");
      let [c, pe, pr, mq, mn, ag, cd, fn, op, vd, us, lg, sc, dsp, flh, func, mtr, cam, empR, galDiv, msgs, cub, comprMat, movEst, bombaC, cTraco, rDiesel, bmb, agd, os, pcs, movPcs] = await Promise.all([
        loadCollection(STORAGE_KEYS.clientes),
        loadCollection(STORAGE_KEYS.producaoEsc),
        loadCollection(STORAGE_KEYS.propostas),
        loadCollection(STORAGE_KEYS.maquinas),
        loadCollection(STORAGE_KEYS.manutencoes),
        loadCollection(STORAGE_KEYS.agenda),
        loadCollection(STORAGE_KEYS.controleDiario),
        loadCollection(STORAGE_KEYS.financeiro),
        loadCollection(STORAGE_KEYS.operadores),
        loadCollection(STORAGE_KEYS.vendedores),
        loadCollection(STORAGE_KEYS.usuarios),
        loadCollection(STORAGE_KEYS.logAcessos),
        loadCollection(STORAGE_KEYS.statusClientes),
        loadCollection(STORAGE_KEYS.despesas),
        loadCollection(STORAGE_KEYS.folhaPagamento),
        loadCollection(STORAGE_KEYS.funcionarios),
        loadCollection(STORAGE_KEYS.motoristas),
        loadCollection(STORAGE_KEYS.caminhoes),
        loadCollection(STORAGE_KEYS.empresasRetirada),
        loadCollection(STORAGE_KEYS.galeriaDivulgacao),
        loadCollection(STORAGE_KEYS.mensagens),
        loadCollection(STORAGE_KEYS.cubicagens),
        loadCollection(STORAGE_KEYS.comprasMaterial),
        loadCollection(STORAGE_KEYS.movimentosEstoque),
        loadCollection(STORAGE_KEYS.bombaConcreto),
        loadCollection(STORAGE_KEYS.cartaTraco),
        loadCollection(STORAGE_KEYS.registrosDiesel),
        loadCollection(STORAGE_KEYS.bombas),
        loadCollection(STORAGE_KEYS.agendamentos),
        loadCollection(STORAGE_KEYS.ordensServico),
        loadCollection(STORAGE_KEYS.pecas),
        loadCollection(STORAGE_KEYS.movimentosPecas),
      ]);

      try {
        const sec = await window.storage.get(STORAGE_KEYS.security, true);
        setSecurity(sec ? JSON.parse(sec.value) : { passwordHash: "" });
      } catch (e) {
        setSecurity({ passwordHash: "" });
      }

      try {
        const appSec = await window.storage.get(STORAGE_KEYS.appAccess, true);
        setAppSecurity(appSec ? JSON.parse(appSec.value) : { passwordHash: "" });
      } catch (e) {
        setAppSecurity({ passwordHash: "" });
      }

      try {
        const pr = await window.storage.get(STORAGE_KEYS.prefs, true);
        if (pr) setPrefs(JSON.parse(pr.value));
      } catch (e) {
        /* mantém padrão */
      }

      if (mq.length === 0) {
        mq = MAQUINAS_PADRAO;
        await saveCollection(STORAGE_KEYS.maquinas, mq);
      }

      if (fn.length === 0 && FINANCEIRO_SEED.length > 0) {
        fn = FINANCEIRO_SEED;
        await saveCollection(STORAGE_KEYS.financeiro, fn);
      }

      if (sc.length === 0) {
        sc = STATUS_CLIENTES_PADRAO;
        await saveCollection(STORAGE_KEYS.statusClientes, sc);
      }

      setClientes(c);
      setProducaoEsc(pe);
      setPropostas(pr);
      setMaquinas(mq);
      setManutencoes(mn);
      setAgenda(ag);
      setControleDiario(cd);
      setFinanceiro(fn);
      setOperadores(op);
      setVendedores(vd);
      setUsuarios(us);
      setLogAcessos(lg);
      setStatusClientes(sc);
      setDespesas(dsp);
      setFolhaPagamento(flh);
      setFuncionarios(func);
      setMotoristas(mtr);
      setCaminhoes(cam);
      setEmpresasRetirada(empR);
      setGaleriaDivulgacao(galDiv);
      setMensagens(msgs);
      setCubicagens(cub);
      setComprasMaterial(comprMat);
      setMovimentosEstoque(movEst);
      setBombaConcreto(bombaC);
      setCartaTraco(cTraco);
      setRegistrosDiesel(rDiesel);
      setBombas(bmb);
      setAgendamentos(agd);
      setOrdensServico(os);
      setPecas(pcs);
      setMovimentosPecas(movPcs);

      lastSyncedRef.current = {
        [STORAGE_KEYS.clientes]: JSON.stringify(c),
        [STORAGE_KEYS.producaoEsc]: JSON.stringify(pe),
        [STORAGE_KEYS.propostas]: JSON.stringify(pr),
        [STORAGE_KEYS.maquinas]: JSON.stringify(mq),
        [STORAGE_KEYS.manutencoes]: JSON.stringify(mn),
        [STORAGE_KEYS.agenda]: JSON.stringify(ag),
        [STORAGE_KEYS.controleDiario]: JSON.stringify(cd),
        [STORAGE_KEYS.financeiro]: JSON.stringify(fn),
        [STORAGE_KEYS.operadores]: JSON.stringify(op),
        [STORAGE_KEYS.vendedores]: JSON.stringify(vd),
        [STORAGE_KEYS.usuarios]: JSON.stringify(us),
        [STORAGE_KEYS.statusClientes]: JSON.stringify(sc),
        [STORAGE_KEYS.despesas]: JSON.stringify(dsp),
        [STORAGE_KEYS.folhaPagamento]: JSON.stringify(flh),
        [STORAGE_KEYS.funcionarios]: JSON.stringify(func),
        [STORAGE_KEYS.motoristas]: JSON.stringify(mtr),
        [STORAGE_KEYS.caminhoes]: JSON.stringify(cam),
        [STORAGE_KEYS.empresasRetirada]: JSON.stringify(empR),
        [STORAGE_KEYS.galeriaDivulgacao]: JSON.stringify(galDiv),
        [STORAGE_KEYS.mensagens]: JSON.stringify(msgs),
        [STORAGE_KEYS.cubicagens]: JSON.stringify(cub),
        [STORAGE_KEYS.comprasMaterial]: JSON.stringify(comprMat),
        [STORAGE_KEYS.movimentosEstoque]: JSON.stringify(movEst),
        [STORAGE_KEYS.bombaConcreto]: JSON.stringify(bombaC),
        [STORAGE_KEYS.cartaTraco]: JSON.stringify(cTraco),
        [STORAGE_KEYS.registrosDiesel]: JSON.stringify(rDiesel),
        [STORAGE_KEYS.bombas]: JSON.stringify(bmb),
        [STORAGE_KEYS.agendamentos]: JSON.stringify(agd),
        [STORAGE_KEYS.ordensServico]: JSON.stringify(os),
        [STORAGE_KEYS.pecas]: JSON.stringify(pcs),
        [STORAGE_KEYS.movimentosPecas]: JSON.stringify(movPcs),
      };

      console.log("[TopLocacoes] App: todas as coleções carregadas com sucesso!");
      terminou = true;
      clearTimeout(travouTimeout);
      setLoading(false);
     } catch (e) {
      console.error("[TopLocacoes] App: ERRO no carregamento:", e);
      terminou = true;
      clearTimeout(travouTimeout);
      setLoadError("Não consegui carregar os dados — verifique sua internet e recarregue a página. Se persistir, avise o administrador (erro: " + (e?.message || "desconhecido") + ").");
     }
    })();
  }, []);

  // Salva sempre em fila, uma ação de cada vez, por área (key). Antes disso,
  // duas ações rápidas na MESMA área (ex.: dois cliques seguidos, dois campos
  // salvando quase juntos) podiam disparar o aviso de "alguém mais salvou"
  // sem ninguém mais ter mexido em nada — a segunda ação conferia o banco
  // antes da primeira terminar de salvar. Enfileirando, a segunda ação só
  // começa a conferir depois que a primeira já terminou e atualizou a
  // referência do que foi salvo por último.
  const persist = useCallback((key, setter, next) => {
    const anterior = persistQueueRef.current[key] || Promise.resolve();
    const vez = anterior.then(() => persistUmaVez(key, setter, next));
    persistQueueRef.current[key] = vez.catch(() => {});
    return vez;
  }, []);

  // Antes disso, cada salvamento conferia se "alguém mais" tinha mexido
  // nessa mesma área desde a última vez, e recusava salvar se achasse
  // diferença — pra nunca sobrescrever o trabalho de outra pessoa sem
  // avisar. Na prática, essa conferência causava mais problema do que
  // resolvia: como ela busca no banco de novo antes de cada salvamento,
  // qualquer oscilação de internet, aba antiga aberta ou pequena demora
  // fazia ela recusar salvamentos legítimos — inclusive de uma pessoa
  // sozinha, sem ninguém mais mexendo em nada, que é exatamente o "não
  // está salvando" que você relatou. Tirei essa conferência: agora salva
  // direto, sempre. Se duas pessoas editarem a MESMA conta/lançamento no
  // mesmíssimo segundo, prevalece quem salvar por último — é a forma mais
  // simples e mais confiável pra várias pessoas usarem ao mesmo tempo sem
  // trombar uma na outra.
  const persistUmaVez = useCallback(async (key, setter, next) => {
    try {
      setter(next);
      const ok = await saveCollection(key, next);
      if (ok) {
        lastSyncedRef.current[key] = JSON.stringify(next);
        return true;
      } else {
        setSaveError("Não consegui salvar agora — verifique sua internet e tente de novo. Se continuar, me avise.");
        setTimeout(() => setSaveError(""), 8000);
        return false;
      }
    } catch (e) {
      if (e.message === "TAMANHO_EXCEDIDO") {
        setSaveError(
          `Essa área de dados (${key.replace("top-locacoes:", "")}) ficou grande demais pra salvar de uma vez (${(e.tamanho / 1024).toFixed(0)} KB) — isso é um limite técnico do banco de dados, não é sua internet. Me avise pra eu resolver isso na estrutura do sistema.`
        );
      } else {
        setSaveError("Não consegui salvar agora — verifique sua internet e tente de novo. Se continuar, me avise.");
        setTimeout(() => setSaveError(""), 8000);
      }
      return false;
    }
  }, []);

  const [propostaDraft, setPropostaDraft] = useState(null);
  const [osDraft, setOsDraft] = useState(null);

  const [avisoPermissao, setAvisoPermissao] = useState("");
  const [tourAberto, setTourAberto] = useState(false);

  const handleNavClick = (id) => {
    const temUsuarios = usuarios.length > 0;
    if (temUsuarios) {
      if (PROTECTED_TABS.includes(id) && !usuarioAtual?.admin) {
        setAvisoPermissao("Essa área é só para administradores.");
        setTimeout(() => setAvisoPermissao(""), 4000);
        return;
      }
      setTab(id);
      return;
    }
    // Compatibilidade com o modelo antigo (senha única), enquanto não há usuários cadastrados
    if (SENHA_ATIVADA && PROTECTED_TABS.includes(id) && !unlocked) {
      setPendingTab(id);
    } else {
      setTab(id);
    }
  };

  const requireAdmin = (action) => {
    const temUsuarios = usuarios.length > 0;
    if (temUsuarios) {
      if (usuarioAtual?.admin) {
        action();
      } else {
        setAvisoPermissao("Essa ação é só para administradores.");
        setTimeout(() => setAvisoPermissao(""), 4000);
      }
      return;
    }
    if (!SENHA_ATIVADA || unlocked) {
      action();
    } else {
      setPendingAction(() => action);
    }
  };

  useEffect(() => {
    ADMIN_HASH_REF = security?.passwordHash || "";
  }, [security]);

  useEffect(() => {
    USUARIO_ATUAL_REF = usuarioAtual;
  }, [usuarioAtual]);

  useEffect(() => {
    PREFS_ATUAL_REF = prefs || {};
  }, [prefs]);

  useEffect(() => {
    if (usuarioAtual && usuarioAtual.tourVisto === false) {
      setTourAberto(true);
    }
  }, [usuarioAtual]);

  const fecharTour = () => {
    setTourAberto(false);
    if (usuarioAtual && !usuarioAtual.tourVisto) {
      const atualizado = { ...usuarioAtual, tourVisto: true };
      setUsuarioAtual(atualizado);
      persist(STORAGE_KEYS.usuarios, setUsuarios, usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)));
    }
  };

  const clienteByPedido = useMemo(() => {
    const map = new Map();
    clientes.forEach((c) => {
      if (c.pedido) map.set(String(c.pedido).trim(), c);
    });
    return map;
  }, [clientes]);

  // Espelha TODO lançamento de Produção como conta a receber no Financeiro
  // — não só os pagos. Assim "Em aberto" e "Atrasado" aparecem certinho na
  // aba A Receber também, e não só dentro de Produção. O status de cada um
  // fica sempre sincronizado com o que está na Produção.
  useEffect(() => {
    if (loading) return;
    const mapaStatus = { "EM ABERTO": "Pendente", BOLETO: "Boleto", PIX: "Pix", PAGO: "Pago" };
    const todos = [
      ...producaoEsc.map((r) => ({ ...r, tipoEquip: "Escavadeira" })),
    ];
    const existentesPorProducaoId = new Map(financeiro.filter((c) => c.producaoId).map((c) => [c.producaoId, c]));

    let mudou = false;
    const semSincronizados = financeiro.filter((c) => !c.producaoId);
    const sincronizados = todos.map((r) => {
      const statusFin = mapaStatus[String(r.status || "").trim().toUpperCase()] || "Pendente";
      const existente = existentesPorProducaoId.get(r.id);
      const contaDesejada = {
        id: existente?.id || uid(),
        producaoId: r.id,
        tipo: "Receber",
        descricao: `Concreto — ${r.equipamento || "-"}`,
        fornecedor: r.cliente || "",
        pedido: r.pedido || "",
        valor: numeroSeguro(r.total),
        // Data em que o serviço foi realizado — diferente do vencimento
        // (que é a data limite pra pagar). Serve de referência mesmo
        // quando ainda não venceu.
        dataServico: r.data || "",
        // Vencimento = data do serviço + 30 dias (prazo padrão de
        // pagamento) — não a data do serviço em si, senão todo trabalho
        // recém-feito já nasceria "atrasado" antes mesmo de vencer.
        vencimento: adicionarDias(r.data, 30) || r.data || "",
        dataPagamento: statusFin === "Pago" ? r.data || "" : "",
        status: statusFin,
        formaPagamento: r.formaPagamento || existente?.formaPagamento || "",
        valorPago: r.valorPago || "",
        dataProximoPagamento: r.dataProximoPagamento || "",
      };
      if (
        !existente ||
        existente.status !== contaDesejada.status ||
        existente.valor !== contaDesejada.valor ||
        existente.pedido !== contaDesejada.pedido ||
        existente.vencimento !== contaDesejada.vencimento ||
        existente.dataServico !== contaDesejada.dataServico ||
        existente.valorPago !== contaDesejada.valorPago ||
        existente.dataProximoPagamento !== contaDesejada.dataProximoPagamento
      ) {
        mudou = true;
      }
      return contaDesejada;
    });

    if (mudou || existentesPorProducaoId.size !== todos.length) {
      persist(STORAGE_KEYS.financeiro, setFinanceiro, [...semSincronizados, ...sincronizados]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producaoEsc, producaoPerf, loading]);

  // Lista de equipamentos pro formulário de "Novo lançamento" — junta os
  // nomes cadastrados em Configurações → Cadastros → Máquinas com a lista
  // original padrão e com qualquer equipamento já usado em lançamentos
  // antigos, pra nada se perder. Assim, pra adicionar mais opções, basta
  // cadastrar a máquina nova em Configurações — sem precisar mexer em código.
  // A lista de equipamentos do dropdown vem só do cadastro de Máquinas
  // (Configurações → Cadastros → Máquinas) — sem lista fixa escondida no
  // código. Pra adicionar ou remover uma opção, é só mexer lá.
  const equipamentosEsc = useMemo(() => porNome(maquinas.map((m) => m.nome)), [maquinas]);
  const equipamentosPerf = useMemo(() => porNome(maquinas.map((m) => m.nome)), [maquinas]);

  if (loading) {
    return (
      <div className={`tl-app ${prefs.theme === "light" ? "tl-light" : ""}`} style={{ "--tl-font-scale": prefs.fontScale || 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <FontStyles />
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <img src={LOGO_DATA_URI()} alt="Logo" style={{ width: "84px", height: "84px", borderRadius: "16px", margin: "0 auto 18px", display: "block", background: "#F5F2E9" }} />
          <div className="tl-display" style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}
          </div>
          <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", marginTop: "4px", letterSpacing: "0.06em", marginBottom: "20px" }}>
            CONSOLE OPERACIONAL
          </div>
          {loadError ? (
            <>
              <p style={{ marginTop: "10px", fontSize: "13px", color: "var(--danger)", maxWidth: "320px", lineHeight: 1.5 }}>{loadError}</p>
              <Button style={{ marginTop: "14px" }} onClick={() => window.location.reload()}>Recarregar página</Button>
            </>
          ) : (
            <>
              <BetoneiraAndando />
              <p style={{ marginTop: "6px", fontSize: "13px" }}>Carregando dados...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (campoMode) {
    return (
      <div className={`tl-app ${prefs.theme === "light" ? "tl-light" : ""}`} style={{ "--tl-font-scale": prefs.fontScale || 1 }}>
        <FontStyles />
        <CampoShell
          maquinas={maquinas}
          manutencoes={manutencoes}
          controleDiario={controleDiario}
          onChangeManutencoes={(next) => persist(STORAGE_KEYS.manutencoes, setManutencoes, next)}
          onChangeControleDiario={(next) => persist(STORAGE_KEYS.controleDiario, setControleDiario, next)}
        />
      </div>
    );
  }

  if (!usuarioAtual) {
    return (
      <div className={`tl-app ${prefs.theme === "light" ? "tl-light" : ""}`} style={{ "--tl-font-scale": prefs.fontScale || 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <FontStyles />
        <UsuarioLoginGate
          usuarios={usuarios}
          onLogin={async (nome, senha) => {
            const usuario = usuarios.find((u) => u.nome === nome);
            if (!usuario) return false;
            const hash = await hashPassword(senha);
            if (hash === usuario.senhaHash) {
              setUsuarioAtual(usuario);
              try {
                localStorage.setItem("tl-usuario-logado", usuario.nome);
              } catch (e) {}
              await registrarLog("Login", usuario.nome);
              return true;
            }
            return false;
          }}
          onCriarPrimeiroAdmin={async (nome, senha) => {
            const hash = await hashPassword(senha);
            const novoUsuario = { id: uid(), nome, senhaHash: hash, admin: true, ativo: true, tourVisto: false };
            await persist(STORAGE_KEYS.usuarios, setUsuarios, [novoUsuario]);
            setUsuarioAtual(novoUsuario);
            try {
              localStorage.setItem("tl-usuario-logado", novoUsuario.nome);
            } catch (e) {}
            await registrarLog("Login", novoUsuario.nome);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`tl-app ${prefs.theme === "light" ? "tl-light" : ""}`} style={{ "--tl-font-scale": prefs.fontScale || 1 }}>
      <FontStyles />
      {saveError && (
        <div
          style={{
            position: "fixed",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "var(--danger)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          ⚠️ {saveError}
        </div>
      )}
      {avisoPermissao && (
        <div
          style={{
            position: "fixed",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "var(--amber)",
            color: "#1a1a1a",
            padding: "10px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          🔒 {avisoPermissao}
        </div>
      )}
      <BotaoAjudaMascote onAbrir={() => setTourAberto(true)} />
      {!campoMode && (
        <button
          onClick={async () => {
            setAtualizando(true);
            await atualizarDadosRecentes();
            setAtualizando(false);
          }}
          className="tl-focus"
          title="Atualizar dados agora (tick, agenda, manutenção, financeiro)"
          disabled={atualizando}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "92px",
            zIndex: 900,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "var(--bg-panel)",
            border: "1px solid var(--border)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RefreshCw size={17} style={{ color: "var(--text-muted)", animation: atualizando ? "spin 1s linear infinite" : "none" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </button>
      )}
      {tourAberto && <MascoteTour onFechar={fecharTour} />}
      <div className="tl-shell">
        <Sidebar
          tab={tab}
          setTab={handleNavClick}
          locked={usuarios.length > 0 ? !usuarioAtual?.admin : !unlocked}
          usuarioAtual={usuarioAtual}
          naoLidas={contarNaoLidas(mensagens, usuarioAtual?.nome || "")}
          prefs={prefs}
          onLogout={() => {
            setUsuarioAtual(null);
            try {
              localStorage.removeItem("tl-usuario-logado");
            } catch (e) {}
          }}
        />
        <main className="tl-scrollbar tl-main" style={{ overflowY: "auto", padding: "28px 32px 60px", maxWidth: "1180px" }}>
          {tab === "mensagens" && (
            <MensagensModule
              mensagens={mensagens}
              usuarios={usuarios}
              usuarioAtual={usuarioAtual}
              onChange={(next) => persist(STORAGE_KEYS.mensagens, setMensagens, next)}
            />
          )}
          {tab === "dashboard" && (
            <DashboardBombas
              clientes={clientes}
              bombas={bombas}
              agendamentos={agendamentos}
              ordensServico={ordensServico}
              propostas={propostas}
              financeiro={financeiro}
              despesas={despesas}
              goTo={setTab}
            />
          )}
          {tab === "clientes" && (
            <ClientesModule
              clientes={clientes}
              onChange={(next) => persist(STORAGE_KEYS.clientes, setClientes, next)}
              statusClientes={statusClientes}
              producaoEsc={producaoEsc}
              producaoPerf={producaoPerf}
              ticks={ticks}
            />
          )}
          {tab === "bombas" && (
            <BombasModule
              bombas={bombas}
              agendamentos={agendamentos}
              onChange={(next) => persist(STORAGE_KEYS.bombas, setBombas, next)}
            />
          )}
          {tab === "propostas" && (
            <PropostasModule
              propostas={propostas}
              clientes={clientes}
              vendedores={vendedores}
              onChange={(next) => persist(STORAGE_KEYS.propostas, setPropostas, next)}
              draft={propostaDraft}
              onDraftHandled={() => setPropostaDraft(null)}
            />
          )}
          {tab === "manutencao" && (
            <ManutencaoModule
              maquinas={bombas}
              manutencoes={manutencoes}
              onChangeMaquinas={(next) => persist(STORAGE_KEYS.bombas, setBombas, next)}
              onChangeManutencoes={(next) => persist(STORAGE_KEYS.manutencoes, setManutencoes, next)}
            />
          )}
          {tab === "agenda" && (
            <AgendaBombasModule
              agendamentos={agendamentos}
              bombas={bombas}
              clientes={clientes}
              onChange={(next) => persist(STORAGE_KEYS.agendamentos, setAgendamentos, next)}
              onGerarOS={(ag) => {
                setOsDraft(ag);
                setTab("ordensServico");
              }}
            />
          )}
          {tab === "ordensServico" && (
            <OrdensServicoModule
              ordens={ordensServico}
              clientes={clientes}
              bombas={bombas}
              agendamentos={agendamentos}
              onChange={(next) => persist(STORAGE_KEYS.ordensServico, setOrdensServico, next)}
              draft={osDraft}
              onDraftHandled={() => setOsDraft(null)}
            />
          )}
          {tab === "financeiro" && (
            <FinanceiroModule
              contas={financeiro}
              clientes={clientes}
              clienteByPedido={clienteByPedido}
              producaoEsc={[]}
              producaoPerf={[]}
              onChangeProducaoEsc={() => {}}
              onChangeProducaoPerf={() => {}}
              despesas={despesas}
              onChangeDespesas={(next) => persist(STORAGE_KEYS.despesas, setDespesas, next)}
              onChange={(next) => persist(STORAGE_KEYS.financeiro, setFinanceiro, next)}
              propostas={propostas}
            />
          )}
          {tab === "abastecimento" && (
            <DieselModule
              registros={registrosDiesel}
              onChange={(next) => persist(STORAGE_KEYS.registrosDiesel, setRegistrosDiesel, next)}
            />
          )}
          {tab === "estoquePecas" && (
            <EstoquePecasModule
              pecas={pecas}
              movimentos={movimentosPecas}
              bombas={bombas}
              onChangePecas={(next) => persist(STORAGE_KEYS.pecas, setPecas, next)}
              onChangeMovimentos={(next) => persist(STORAGE_KEYS.movimentosPecas, setMovimentosPecas, next)}
            />
          )}
          {tab === "despesas" && (
            <DespesasModule
              despesas={despesas}
              onChange={(next) => persist(STORAGE_KEYS.despesas, setDespesas, next)}
              financeiro={financeiro}
              onChangeFinanceiro={(next) => persist(STORAGE_KEYS.financeiro, setFinanceiro, next)}
            />
          )}
          {tab === "folhaPagamento" && (
            <FolhaPagamentoModule
              folha={folhaPagamento}
              onChange={(next) => persist(STORAGE_KEYS.folhaPagamento, setFolhaPagamento, next)}
              financeiro={financeiro}
              onChangeFinanceiro={(next) => persist(STORAGE_KEYS.financeiro, setFinanceiro, next)}
              funcionarios={funcionarios}
            />
          )}
          {tab === "relatorios" && (
            <RelatoriosBombasModule
              clientes={clientes}
              bombas={bombas}
              agendamentos={agendamentos}
              ordensServico={ordensServico}
              propostas={propostas}
              financeiro={financeiro}
              despesas={despesas}
              manutencoes={manutencoes}
              vendedores={vendedores}
            />
          )}
          {tab === "configuracoes" && (
            <ConfiguracoesModule
              onPasswordChanged={async (newHash) => {
                const newSecurity = { passwordHash: newHash };
                await window.storage.set(STORAGE_KEYS.security, JSON.stringify(newSecurity), true);
                setSecurity(newSecurity);
              }}
              onAppPasswordChanged={async (newHash) => {
                const newAppSecurity = { passwordHash: newHash };
                await window.storage.set(STORAGE_KEYS.appAccess, JSON.stringify(newAppSecurity), true);
                setAppSecurity(newAppSecurity);
              }}
              prefs={prefs}
              onPrefsChanged={async (next) => {
                setPrefs(next);
                await window.storage.set(STORAGE_KEYS.prefs, JSON.stringify(next), true);
              }}
              maquinas={maquinas}
              onChangeMaquinas={(next) => persist(STORAGE_KEYS.maquinas, setMaquinas, next)}
              operadores={operadores}
              onChangeOperadores={(next) => persist(STORAGE_KEYS.operadores, setOperadores, next)}
              vendedores={vendedores}
              onChangeVendedores={(next) => persist(STORAGE_KEYS.vendedores, setVendedores, next)}
              usuarios={usuarios}
              onChangeUsuarios={(next) => persist(STORAGE_KEYS.usuarios, setUsuarios, next)}
              logAcessos={logAcessos}
              clientes={clientes}
              onChangeClientes={(next) => persist(STORAGE_KEYS.clientes, setClientes, next)}
              producaoEsc={producaoEsc}
              onChangeProducaoEsc={(next) => persist(STORAGE_KEYS.producaoEsc, setProducaoEsc, next)}
              producaoPerf={[]}
              onChangeProducaoPerf={() => {}}
              statusClientes={statusClientes}
              onChangeStatusClientes={(next) => persist(STORAGE_KEYS.statusClientes, setStatusClientes, next)}
              financeiro={financeiro}
              onChangeFinanceiro={(next) => persist(STORAGE_KEYS.financeiro, setFinanceiro, next)}
              manutencoes={manutencoes}
              onChangeManutencoes={(next) => persist(STORAGE_KEYS.manutencoes, setManutencoes, next)}
              agenda={agenda}
              onChangeAgenda={(next) => persist(STORAGE_KEYS.agenda, setAgenda, next)}
              funcionarios={funcionarios}
              onChangeFuncionarios={(next) => persist(STORAGE_KEYS.funcionarios, setFuncionarios, next)}
              motoristas={motoristas}
              onChangeMotoristas={(next) => persist(STORAGE_KEYS.motoristas, setMotoristas, next)}
              caminhoes={caminhoes}
              onChangeCaminhoes={(next) => persist(STORAGE_KEYS.caminhoes, setCaminhoes, next)}
              empresasRetirada={empresasRetirada}
              onChangeEmpresasRetirada={(next) => persist(STORAGE_KEYS.empresasRetirada, setEmpresasRetirada, next)}
              requireAdmin={requireAdmin}
            />
          )}
        </main>
      </div>
      {(pendingTab || pendingAction) && (
        <PasswordGate
          hasPassword={!!security?.passwordHash}
          onClose={() => { setPendingTab(null); setPendingAction(null); }}
          onSubmit={async (pw) => {
            const grant = () => {
              setUnlocked(true);
              if (pendingTab) { setTab(pendingTab); setPendingTab(null); }
              if (pendingAction) { pendingAction(); setPendingAction(null); }
            };
            if (!security?.passwordHash) {
              const hash = await hashPassword(pw);
              const newSecurity = { passwordHash: hash };
              await window.storage.set(STORAGE_KEYS.security, JSON.stringify(newSecurity), true);
              setSecurity(newSecurity);
              grant();
              return true;
            }
            const hash = await hashPassword(pw);
            if (hash === security.passwordHash) {
              grant();
              return true;
            }
            return false;
          }}
          onReset={async (pw) => {
            const hash = await hashPassword(pw);
            const newSecurity = { passwordHash: hash };
            await window.storage.set(STORAGE_KEYS.security, JSON.stringify(newSecurity), true);
            setSecurity(newSecurity);
            setUnlocked(true);
            if (pendingTab) { setTab(pendingTab); setPendingTab(null); }
            if (pendingAction) { pendingAction(); setPendingAction(null); }
            return true;
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */
function Sidebar({ tab, setTab, locked, usuarioAtual, onLogout, naoLidas, prefs }) {
  return (
    <aside
      className="tl-sidebar"
      style={{
        borderRight: "1px solid var(--border-soft)",
        background: "var(--bg-panel)",
        padding: "22px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "4px 10px 22px", display: "flex", alignItems: "center", gap: "10px" }}>
        <style>{`
          @keyframes tlLogoPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(232,166,61,0)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 6px rgba(232,166,61,0.45)); }
          }
        `}</style>
        <img
          src={LOGO_DATA_URI()}
          alt="Logo"
          style={{ width: "58px", height: "58px", borderRadius: "9px", flexShrink: 0, background: "#F5F2E9", objectFit: "contain" }}
        />
        <div>
          <div className="tl-display" style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "0.01em", lineHeight: 1.2 }}>
            {prefs?.nomeEmpresa || "Sua Empresa"}
          </div>
          <div className="tl-mono" style={{ fontSize: "9.5px", color: "var(--text-faint)", marginTop: "4px", letterSpacing: "0.05em" }}>
            CONSOLE OPERACIONAL
          </div>
        </div>
      </div>
      <nav style={{ display: "flex", gap: "2px" }}>
        {NAV_ITEMS.filter((item) => {
          const papel = usuarioAtual?.papel;
          if (usuarioAtual?.admin || !papel || papel === "Administrador") return true;
          return (ABAS_POR_PAPEL[papel] || []).includes(item.id);
        }).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="tl-focus tl-nav-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "6px",
                border: "none",
                background: active ? "var(--bg-panel-raised)" : "transparent",
                borderLeft: active ? "3px solid var(--amber)" : "3px solid transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: "13.5px",
                fontWeight: active ? 600 : 500,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <item.icon size={16} />
              {item.label}
              {item.id === "mensagens" && naoLidas > 0 && (
                <span style={{ marginLeft: "auto", background: "var(--danger)", color: "#fff", borderRadius: "10px", padding: "1px 6px", fontSize: "10.5px", fontWeight: 700, flexShrink: 0 }}>
                  {naoLidas}
                </span>
              )}
              {SENHA_ATIVADA && locked && PROTECTED_TABS.includes(item.id) && (
                <Lock size={11} style={{ marginLeft: "auto", color: "var(--text-faint)", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", padding: "10px", fontSize: "11px", color: "var(--text-faint)", lineHeight: 1.5 }}>
        Dados compartilhados com toda a equipe. Alterações salvam automaticamente.
      </div>
      {usuarioAtual && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderTop: "1px solid var(--border-soft)", marginTop: "6px" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)" }}>{usuarioAtual.nome}</span>
          <button
            onClick={onLogout}
            className="tl-focus"
            style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: "11.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
            title="Sair da conta"
          >
            <LogOut size={13} /> Sair
          </button>
        </div>
      )}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                           */
/* ------------------------------------------------------------------ */
function Dashboard({ clientes, producaoEsc, producaoPerf, propostas, agenda, financeiro, goTo }) {
  // Conta PEDIDOS únicos em aberto, não lançamentos — um mesmo pedido pode
  // ter vários lançamentos (ex: vários dias de serviço), e isso não pode
  // contar como "vários pedidos" separados.
  const abertos = new Set(
    [...producaoEsc, ...producaoPerf]
      .filter((r) => r.status === "EM ABERTO" && r.pedido)
      .map((r) => String(r.pedido).trim())
  ).size;
  const hojeISO = new Date().toISOString().slice(0, 10);
  const compromissosHoje = (agenda || []).filter((a) => dataOrdenavel(a.data) === hojeISO && a.status !== "Concluído");
  const compromissosAtrasados = (agenda || []).filter((a) => a.data && dataOrdenavel(a.data) < hojeISO && a.status !== "Concluído");
  const [mesFechamento, setMesFechamento] = useState(null);

  const amanhaISO = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const contasVencendo = (financeiro || []).filter(
    (c) => (c.status === "Pendente" || c.status === "Boleto") && (dataOrdenavel(c.vencimento) === hojeISO || dataOrdenavel(c.vencimento) === amanhaISO)
  );
  const contasVencendoHoje = contasVencendo.filter((c) => dataOrdenavel(c.vencimento) === hojeISO);
  const contasAPagarVencendo = contasVencendo.filter((c) => c.tipo === "Pagar");
  const contasAReceberVencendo = contasVencendo.filter((c) => c.tipo === "Receber");

  const faturamentoMensal = useMemo(() => {
    const map = new Map();
    [...producaoEsc, ...producaoPerf].forEach((r) => {
      if (!r.data) return;
      const mes = r.data.slice(0, 7);
      map.set(mes, (map.get(mes) || 0) + (Number(r.total) || 0));
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  }, [producaoEsc, producaoPerf]);

  const stats = [
    { label: "Clientes cadastrados", value: clientes.length, icon: Users, go: "clientes" },
    { label: "Pedidos em aberto", value: abertos, icon: AlertTriangle, go: "producaoEsc" },
    { label: "Propostas emitidas", value: propostas.length, icon: FileText, go: "propostas" },
  ];

  return (
    <div className="tl-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "22px" }}>
        <style>{`
          @keyframes tlLogoPainelPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.06) rotate(-1.5deg); }
          }
        `}</style>
        <img
          src={LOGO_DATA_URI()}
          alt="Logo"
          style={{
            width: "84px",
            height: "84px",
            borderRadius: "16px",
            background: "#F5F2E9",
            boxShadow: "0 6px 20px rgba(232,166,61,0.25)",
            animation: "tlLogoPainelPulse 4s ease-in-out infinite",
          }}
        />
        <div>
          <div className="tl-display" style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1 }}>
            {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}
          </div>
          <div className="tl-mono" style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "6px", letterSpacing: "0.05em" }}>
            CONSOLE OPERACIONAL
          </div>
        </div>
      </div>

      <PageHeader eyebrow="Visão geral" title="Painel operacional" />

      <button
        onClick={() => goTo("relatorios")}
        className="tl-focus"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          width: "100%",
          textAlign: "left",
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "9px",
          padding: "12px 16px",
          marginBottom: "16px",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart3 size={16} style={{ color: "var(--amber)" }} />
          <span style={{ fontSize: "13px" }}>Novo: análises de inadimplência, rentabilidade por máquina, comparativo mensal e produtividade por operador</span>
        </div>
        <ChevronRight size={15} style={{ color: "var(--text-faint)" }} />
      </button>

      {(compromissosHoje.length > 0 || compromissosAtrasados.length > 0) && (
        <button
          onClick={() => goTo("agenda")}
          className="tl-focus"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            textAlign: "left",
            background: "#3A2F13",
            border: "1px solid #5A4A1F",
            borderRadius: "9px",
            padding: "14px 16px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          <Bell size={18} style={{ color: "var(--amber)", flexShrink: 0 }} />
          <div style={{ fontSize: "13px", color: "#E8A63D" }}>
            {compromissosHoje.length > 0 && <strong>{compromissosHoje.length} compromisso{compromissosHoje.length > 1 ? "s" : ""} hoje</strong>}
            {compromissosHoje.length > 0 && compromissosAtrasados.length > 0 && " · "}
            {compromissosAtrasados.length > 0 && <strong>{compromissosAtrasados.length} atrasado{compromissosAtrasados.length > 1 ? "s" : ""}</strong>}
            {" "}— clique para ver a agenda
          </div>
        </button>
      )}

      {contasVencendo.length > 0 && (
        <button
          onClick={() => goTo("financeiro")}
          className="tl-focus"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            textAlign: "left",
            background: "#3A1E1E",
            border: "1px solid #5A2F2F",
            borderRadius: "9px",
            padding: "14px 16px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          <Wallet size={18} style={{ color: "var(--danger)", flexShrink: 0 }} />
          <div style={{ fontSize: "13px", color: "#D6706F" }}>
            <strong>
              {contasVencendo.length} conta{contasVencendo.length > 1 ? "s" : ""} vencendo {contasVencendoHoje.length > 0 ? "hoje" : "amanhã"}
            </strong>
            {contasAReceberVencendo.length > 0 && ` · ${contasAReceberVencendo.length} a receber`}
            {contasAPagarVencendo.length > 0 && ` · ${contasAPagarVencendo.length} a pagar`}
            {" "}— clique para ver o financeiro
          </div>
        </button>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "34px" }}>
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => goTo(s.go)}
            className="tl-focus"
            style={{
              textAlign: "left",
              background: "var(--bg-panel)",
              border: "1px solid var(--border-soft)",
              borderRadius: "9px",
              padding: "18px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <s.icon size={17} style={{ color: "var(--amber)" }} />
              <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="tl-display" style={{ fontSize: "30px", fontWeight: 700, marginTop: "10px" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "26px" }}>
        <h4 className="tl-mono" style={{ fontSize: "11.5px", letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
          Faturamento por mês (Produção)
        </h4>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "18px" }}>
          <GraficoBarras
            series={[{ nome: "Faturamento", cor: "var(--amber)", dados: faturamentoMensal.map(([mes, valor]) => ({ label: mes, valor })) }]}
            onBarClick={(mes) => setMesFechamento(mes)}
          />
        </div>
      </div>

      <div style={{ marginBottom: "26px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <h4 className="tl-mono" style={{ fontSize: "11.5px", letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Calendário de máquinas
          </h4>
          <Button size="sm" variant="subtle" onClick={() => goTo("agenda")}>Abrir agenda completa</Button>
        </div>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px" }}>
          <CalendarioMensal agenda={agenda} producaoEsc={producaoEsc} producaoPerf={producaoPerf} compacto />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        <RecentList title="Últimos pedidos" records={producaoEsc.slice(-5).reverse()} />
      </div>

      {mesFechamento && (
        <FechamentoMensalModal
          mes={mesFechamento}
          producaoEsc={producaoEsc}
          producaoPerf={producaoPerf}
          financeiro={financeiro}
          clientes={clientes}
          onClose={() => setMesFechamento(null)}
        />
      )}
    </div>
  );
}

function FechamentoMensalModal({ mes, producaoEsc, producaoPerf, financeiro, clientes, onClose }) {
  const lancamentos = useMemo(() => {
    const esc = producaoEsc.filter((r) => (r.data || "").slice(0, 7) === mes).map((r) => ({ ...r, tipoEquip: "Escavadeira" }));
    return esc.sort((a, b) => dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data)));
  }, [mes, producaoEsc]);

  const totalFaturado = lancamentos.reduce((s, r) => s + numeroSeguro(r.total), 0);
  const totalRecebido = lancamentos.filter((r) => String(r.status || "").toUpperCase() === "PAGO").reduce((s, r) => s + numeroSeguro(r.total), 0);
  const totalAberto = totalFaturado - totalRecebido;

  const porCliente = useMemo(() => {
    const mapa = new Map();
    lancamentos.forEach((r) => {
      const nome = r.cliente || "Cliente não identificado";
      mapa.set(nome, (mapa.get(nome) || 0) + numeroSeguro(r.total));
    });
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
  }, [lancamentos]);

  const nomeMes = new Date(`${mes}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <Modal title={`Fechamento — ${nomeMes}`} onClose={onClose} wide>
      <div className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", borderRadius: "6px", padding: "28px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #1a1a1a", paddingBottom: "14px", marginBottom: "20px" }}>
          <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", borderRadius: "6px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "19px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{[PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" — ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", textTransform: "capitalize" }}>FECHAMENTO — {nomeMes}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          <div style={{ background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10.5px", color: "#777" }}>FATURADO NO MÊS</div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>{money(totalFaturado)}</div>
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10.5px", color: "#777" }}>RECEBIDO</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#2e7d32" }}>{money(totalRecebido)}</div>
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10.5px", color: "#777" }}>EM ABERTO</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#c77700" }}>{money(totalAberto)}</div>
          </div>
        </div>

        <strong style={{ fontSize: "13.5px" }}>Por cliente ({porCliente.length})</strong>
        {porCliente.map(([nome, valor]) => (
          <ReportRow key={nome} label={nome} value={money(valor)} />
        ))}

        <div style={{ marginTop: "18px" }}>
          <strong style={{ fontSize: "13.5px" }}>Todos os lançamentos ({lancamentos.length})</strong>
          {lancamentos.map((r) => (
            <ReportRow
              key={r.id}
              label={`${fmtDate(r.data)} — ${r.cliente || "-"} (${r.tipoEquip}, ${r.equipamento || "-"}) · ${r.status}`}
              value={money(r.total)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
    </Modal>
  );
}

function RecentList({ title, records }) {
  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px" }}>
      <h4 className="tl-mono" style={{ fontSize: "11.5px", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase" }}>
        {title}
      </h4>
      {records.length === 0 ? (
        <p style={{ fontSize: "13px", color: "var(--text-faint)" }}>Nenhum registro ainda.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {records.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <span className="tl-mono" style={{ color: "var(--amber)", fontWeight: 600 }}>#{r.pedido}</span>
                <span style={{ color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.cliente || "—"}
                </span>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyMensagem = () => ({ id: uid(), de: "", para: "", texto: "", dataHora: new Date().toISOString(), lidaPor: [] });

// Contador de mensagens não lidas pra um usuário — usado tanto dentro do
// módulo quanto no selo (badge) do menu lateral, sem precisar abrir a tela.
function contarNaoLidas(mensagens, meuNome) {
  return (mensagens || []).filter((m) => m.de !== meuNome && (m.para === meuNome || m.para === "TODOS") && !(m.lidaPor || []).includes(meuNome)).length;
}

function MensagensModule({ mensagens, usuarios, usuarioAtual, onChange }) {
  const [conversaAtiva, setConversaAtiva] = useState(null); // nome do outro usuário, ou "TODOS"
  const [texto, setTexto] = useState("");
  const meuNome = usuarioAtual?.nome || "";

  const outrosUsuarios = useMemo(
    () => [...(usuarios || [])].filter((u) => u.nome !== meuNome).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [usuarios, meuNome]
  );

  const mensagensDaConversa = (participante) => {
    return mensagens
      .filter((m) => {
        if (participante === "TODOS") return m.para === "TODOS";
        return (m.de === meuNome && m.para === participante) || (m.de === participante && m.para === meuNome);
      })
      .sort((a, b) => (a.dataHora || "").localeCompare(b.dataHora || ""));
  };

  const naoLidasDe = (participante) => mensagensDaConversa(participante).filter((m) => m.de !== meuNome && !(m.lidaPor || []).includes(meuNome)).length;

  const abrirConversa = (participante) => {
    setConversaAtiva(participante);
    const pendentes = mensagensDaConversa(participante).filter((m) => m.de !== meuNome && !(m.lidaPor || []).includes(meuNome));
    if (pendentes.length > 0) {
      const idsParaMarcar = new Set(pendentes.map((m) => m.id));
      onChange(mensagens.map((m) => (idsParaMarcar.has(m.id) ? { ...m, lidaPor: [...(m.lidaPor || []), meuNome] } : m)));
    }
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim() || !conversaAtiva) return;
    const nova = { id: uid(), de: meuNome, para: conversaAtiva, texto: texto.trim(), dataHora: new Date().toISOString(), lidaPor: [meuNome] };
    onChange([...mensagens, nova]);
    setTexto("");
  };

  const listaConversa = conversaAtiva ? mensagensDaConversa(conversaAtiva) : [];

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Equipe" title="Mensagens" />
      <div style={{ display: "flex", gap: "0", border: "1px solid var(--border-soft)", borderRadius: "10px", overflow: "hidden", height: "68vh", minHeight: "420px" }}>
        <div style={{ width: "230px", flexShrink: 0, borderRight: "1px solid var(--border-soft)", background: "var(--bg-panel)", overflowY: "auto" }}>
          <button
            onClick={() => abrirConversa("TODOS")}
            className="tl-focus"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 14px",
              border: "none",
              borderBottom: "1px solid var(--border-soft)",
              background: conversaAtiva === "TODOS" ? "var(--bg-panel-raised)" : "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "13.5px" }}>
              <Megaphone size={14} style={{ color: "var(--amber)" }} /> Avisos gerais
            </span>
            {naoLidasDe("TODOS") > 0 && (
              <span style={{ background: "var(--danger)", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>
                {naoLidasDe("TODOS")}
              </span>
            )}
          </button>
          {outrosUsuarios.map((u) => (
            <button
              key={u.id}
              onClick={() => abrirConversa(u.nome)}
              className="tl-focus"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid var(--border-soft)",
                background: conversaAtiva === u.nome ? "var(--bg-panel-raised)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{u.nome}</span>
              {naoLidasDe(u.nome) > 0 && (
                <span style={{ background: "var(--danger)", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>
                  {naoLidasDe(u.nome)}
                </span>
              )}
            </button>
          ))}
          {outrosUsuarios.length === 0 && (
            <p style={{ fontSize: "12px", color: "var(--text-faint)", padding: "12px 14px" }}>Só você tem conta cadastrada por enquanto — cadastre outros usuários em Configurações pra poder conversar com eles.</p>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
          {!conversaAtiva ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EmptyState icon={MessageSquare} title="Escolha uma conversa" hint="Clica em alguém na lista ao lado, ou em 'Avisos gerais' pra mandar recado pra todo mundo." />
            </div>
          ) : (
            <>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", fontWeight: 600, fontSize: "14px" }}>
                {conversaAtiva === "TODOS" ? "Avisos gerais (todo mundo vê)" : conversaAtiva}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {listaConversa.length === 0 ? (
                  <p style={{ fontSize: "12.5px", color: "var(--text-faint)", textAlign: "center", marginTop: "20px" }}>Nenhuma mensagem ainda — manda a primeira!</p>
                ) : (
                  listaConversa.map((m) => {
                    const minha = m.de === meuNome;
                    return (
                      <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: minha ? "flex-end" : "flex-start" }}>
                        <div
                          style={{
                            maxWidth: "72%",
                            background: minha ? "var(--accent)" : "var(--bg-panel)",
                            color: minha ? "var(--accent-text)" : "var(--text-primary)",
                            border: minha ? "none" : "1px solid var(--border-soft)",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            fontSize: "13.5px",
                            wordBreak: "break-word",
                          }}
                        >
                          {conversaAtiva === "TODOS" && !minha && <div style={{ fontSize: "11px", fontWeight: 700, opacity: 0.75, marginBottom: "2px" }}>{m.de}</div>}
                          {m.texto}
                        </div>
                        <span style={{ fontSize: "10.5px", color: "var(--text-faint)", marginTop: "2px" }}>{new Date(m.dataHora).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={enviar} style={{ display: "flex", gap: "8px", padding: "12px 16px", borderTop: "1px solid var(--border-soft)" }}>
                <Input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva uma mensagem..." style={{ flex: 1 }} />
                <Button type="submit" icon={Send} disabled={!texto.trim()}>Enviar</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "22px" }}>
      <div>
        <div className="tl-mono" style={{ fontSize: "11px", color: "var(--amber)", letterSpacing: "0.08em", marginBottom: "4px" }}>
          {eyebrow}
        </div>
        <h1 className="tl-display" style={{ fontSize: "32px", fontWeight: 700 }}>
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Clientes module                                                     */
/* ------------------------------------------------------------------ */
// Monta o endereço completo do cliente (rua, número, bairro, complemento,
// CEP) numa única linha pronta pra mostrar — usado em Produção, Propostas
// e Ordem de Serviço, sempre que o pedido bater com um cliente cadastrado.
function enderecoCompleto(cliente) {
  if (!cliente) return "";
  const partes = [];
  if (cliente.endereco) partes.push(cliente.numero ? `${cliente.endereco}, ${cliente.numero}` : cliente.endereco);
  if (cliente.bairro) partes.push(cliente.bairro);
  if (cliente.complemento) partes.push(cliente.complemento);
  if (cliente.cep) partes.push(`CEP ${cliente.cep}`);
  return partes.join(" — ");
}

// Calcula o total de um lançamento de Produção genérico (mesma fórmula do
// formulário de edição) — usado pra conferir se o "valor pago" salvo bate
// com o que deveria ser, mesmo fora do formulário.
// Subtotal de uma carga/viagem — volume × valor por m³. A bomba dessa carga
// entra à parte, direto (não é multiplicada pelo volume).
function subtotalCarga(v) {
  return (Number(v.volume) || 0) * (Number(v.valor) || 0);
}

// Recalcula "metro cúbico" e "total" de um lançamento a partir das cargas
// que ele tem — usada tanto ao editar o lançamento quanto ao editar as
// cargas direto pela Central de Balança, pra nunca ficar desalinhado.
function recalcularComCargas(record) {
  const viagens = record.viagens || [];
  const viagensTotal = viagens.reduce((s, v) => s + subtotalCarga(v) + (Number(v.valorBomba) || 0), 0);
  const volumeCargas = viagens.reduce((s, v) => s + (Number(v.volume) || 0), 0);
  const temCargasComValor = viagens.some((v) => numeroSeguro(v.valor) > 0 || numeroSeguro(v.valorBomba) > 0);
  const metroCubicoEfetivo = volumeCargas > 0 ? volumeCargas : Number(record.qtdDias) || 0;
  return {
    ...record,
    qtdDias: volumeCargas > 0 ? metroCubicoEfetivo : record.qtdDias,
    total: temCargasComValor
      ? viagensTotal + (Number(record.frete) || 0)
      : metroCubicoEfetivo * (Number(record.valorDiaria) || 0) + (Number(record.frete) || 0) + viagensTotal,
  };
}

function calcularTotalProducao(r) {
  const viagens = r.viagens || [];
  const viagensTotal = viagens.reduce((s, v) => s + subtotalCarga(v) + (Number(v.valorBomba) || 0), 0);
  const temCargasComValor = viagens.some((v) => (Number(v.valor) || 0) > 0 || (Number(v.valorBomba) || 0) > 0);
  if (temCargasComValor) return viagensTotal + (Number(r.frete) || 0);
  return (Number(r.qtdDias) || 0) * (Number(r.valorDiaria) || 0) + (Number(r.frete) || 0) + viagensTotal;
}

// Monta a conta do Financeiro correspondente a um lançamento de Produção —
// a mesma fórmula usada na sincronização automática, reaproveitada aqui
// pra deixar a importação em massa já com o Financeiro pronto na hora,
// sem depender do processo de sincronização rodar depois em segundo plano.
function gerarContaFinanceiraDeProducao(r, tipoEquip) {
  const mapaStatus = { "EM ABERTO": "Pendente", BOLETO: "Boleto", PIX: "Pix", PAGO: "Pago" };
  const statusFin = mapaStatus[String(r.status || "").trim().toUpperCase()] || "Pendente";
  return {
    id: uid(),
    producaoId: r.id,
    tipo: "Receber",
    descricao: `Concreto — ${r.equipamento || "-"}`,
    fornecedor: r.cliente || "",
    pedido: r.pedido || "",
    valor: numeroSeguro(r.total),
    dataServico: r.data || "",
    vencimento: adicionarDias(r.data, 30) || r.data || "",
    dataPagamento: statusFin === "Pago" ? r.data || "" : "",
    status: statusFin,
    formaPagamento: r.formaPagamento || "",
    valorPago: r.valorPago || "",
    dataProximoPagamento: r.dataProximoPagamento || "",
  };
}

const emptyCliente = () => ({
  id: uid(),
  pedido: "",
  nome: "",
  empresa: "",
  cpf: "",
  telefone: "",
  email: "",
  endereco: "", // usado como Endereço de Cobrança
  cep: "",
  numero: "",
  bairro: "",
  complemento: "",
  municipio: "",
  uf: "",
  inscricaoEstadual: "",
  enderecoEntrega: "", // obra/local de entrega, quando diferente da cobrança
  obras: [], // várias obras do mesmo cliente — cada uma com endereço, responsável, etc.
  status: "EM ABERTO",
  observacao: "",
});

const emptyObra = () => ({
  id: uid(),
  nome: "",
  endereco: "",
  cep: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  responsavel: "",
  telefoneResponsavel: "",
  observacao: "",
});

// Máscaras: aplica pontuação de CPF/CNPJ e telefone brasileiro enquanto digita.
function formatarCpfCnpj(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
function formatarTelefone(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
function formatarCep(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

function ClientesModule({ clientes, onChange, statusClientes, producaoEsc, producaoPerf, ticks }) {
  const [query, setQuery] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const hojeISO = new Date().toISOString().slice(0, 10);

  const proximoPedido = useMemo(() => {
    const numeros = clientes.map((c) => parseInt(c.pedido, 10)).filter((n) => !isNaN(n));
    return numeros.length ? String(Math.max(...numeros) + 1) : "1";
  }, [clientes]);

  // Última data de atividade de cada cliente (pelo nome) — olha o
  // lançamento de Produção mais recente vinculado a ele, em qualquer um
  // dos pedidos que já teve. Usado pro alerta de "sumido há mais de 1 mês".
  const ultimaAtividadePorNome = useMemo(() => {
    const mapa = new Map();
    [...(producaoEsc || []), ...(producaoPerf || [])].forEach((r) => {
      if (!r.cliente || !r.data) return;
      const chave = r.cliente.trim().toLowerCase();
      const dataAtual = dataOrdenavel(r.data);
      if (!dataAtual) return;
      if (!mapa.has(chave) || dataAtual > mapa.get(chave)) mapa.set(chave, dataAtual);
    });
    return mapa;
  }, [producaoEsc, producaoPerf]);

  const diasSemPedido = (nome) => {
    const ultima = ultimaAtividadePorNome.get((nome || "").trim().toLowerCase());
    if (!ultima) return null;
    const dias = Math.floor((new Date(hojeISO) - new Date(ultima)) / 86400000);
    return dias;
  };

  const clientesParados = useMemo(() => {
    // Só considera clientes com status "Ativo" — sem sentido alertar sobre
    // quem já está marcado como inativo/concluído.
    const nomesUnicos = [...new Set(clientes.filter((c) => c.status === "Ativo").map((c) => c.nome))];
    return nomesUnicos
      .map((nome) => {
        const registros = clientes.filter((c) => c.nome === nome && c.status === "Ativo");
        // Abre o cadastro mais recente (maior número de pedido) quando a
        // pessoa clicar — é o mais provável de ser o contato certo hoje.
        const maisRecente = [...registros].sort((a, b) => (parseInt(b.pedido, 10) || 0) - (parseInt(a.pedido, 10) || 0))[0];
        return { nome, dias: diasSemPedido(nome), registros, maisRecente };
      })
      .filter((c) => c.dias !== null && c.dias > 30)
      .sort((a, b) => b.dias - a.dias);
  }, [clientes, ultimaAtividadePorNome]);

  const filtered = clientes.filter((c) => {
    const q = query.toLowerCase();
    const bateBusca =
      String(c.pedido).toLowerCase().includes(q) ||
      c.nome?.toLowerCase().includes(q) ||
      c.empresa?.toLowerCase().includes(q) ||
      c.telefone?.toLowerCase().includes(q);
    const bateStatus = filtroStatus === "todos" || c.status === filtroStatus;
    return bateBusca && bateStatus;
  });

  const save = (record) => {
    const exists = clientes.some((c) => c.id === record.id);
    onChange(exists ? clientes.map((c) => (c.id === record.id ? record : c)) : [...clientes, record]);
    setEditing(null);
  };

  const remove = (id) => {
    onChange(clientes.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const duplicar = (c) => {
    setEditing({ ...c, id: uid(), pedido: proximoPedido });
  };

  // "Dar baixa" num cliente parado — marca como Inativo (some do alerta
  // sozinho, já que ele só lista clientes com status Ativo).
  const darBaixaParado = (registros) => {
    const idsParaBaixar = new Set(registros.map((r) => r.id));
    onChange(clientes.map((c) => (idsParaBaixar.has(c.id) ? { ...c, status: "Inativo" } : c)));
  };

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Cadastro"
        title="Clientes"
        action={<Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("cliente", emptyCliente, { pedido: proximoPedido }))}>Novo cliente</Button>}
      />

      {clientesParados.length > 0 && (
        <div style={{ background: "var(--bg-panel)", border: "1px solid #E8A63D", borderRadius: "9px", padding: "14px 18px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--amber)", fontWeight: 700, fontSize: "13px" }}>
            <AlertTriangle size={15} /> {clientesParados.length} cliente(s) sem pedido há mais de 1 mês
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {clientesParados.slice(0, 8).map((c) => (
              <div key={c.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                <button
                  onClick={() => setEditing(c.maisRecente)}
                  className="tl-focus"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", color: "var(--text-primary)", fontWeight: 700, textDecoration: "underline", textDecorationColor: "var(--border-soft)" }}
                >
                  {c.nome}
                </button>
                <span style={{ flex: 1 }}>— {c.dias} dias sem novo pedido</span>
                <button
                  onClick={() => darBaixaParado(c.registros)}
                  className="tl-focus"
                  style={{ background: "none", border: "1px solid var(--border-soft)", borderRadius: "5px", padding: "3px 9px", fontSize: "11.5px", color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                  title="Marca como Inativo e tira do aviso"
                >
                  Dar baixa
                </button>
              </div>
            ))}
            {clientesParados.length > 8 && (
              <div style={{ fontSize: "12px", color: "var(--text-faint)" }}>e mais {clientesParados.length - 8}...</div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "18px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", maxWidth: "320px", flex: 1, minWidth: "220px" }}>
          <Search size={15} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <Input placeholder="Buscar por pedido, nome, empresa ou telefone" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: "32px" }} />
        </div>
        <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: "170px" }}>
          <option value="todos">Todo status</option>
          {statusClientes.map((s) => (
            <option key={s.id} value={s.nome}>{s.nome}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum cliente encontrado" hint="Cadastre o primeiro cliente para começar." />
      ) : (
        <Table
          columns={["Pedido", "Nome", "Telefone", "Status", ""]}
          rows={[...filtered].sort((a, b) => (parseInt(b.pedido, 10) || 0) - (parseInt(a.pedido, 10) || 0)).map((c) => (
            <tr key={c.id} style={rowStyle}>
              <td style={tdStyle}><PedidoStub n={c.pedido} /></td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>
                {c.nome}
                {c.empresa && <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 400 }}>{c.empresa}</div>}
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{c.telefone || "-"}</td>
              <td style={tdStyle}><StatusBadge status={c.status} /></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <div style={{ display: "inline-flex", gap: "4px" }}>
                  <button onClick={() => duplicar(c)} className="tl-focus" style={iconBtnStyle} title="Duplicar cliente (novo pedido)">
                    <Copy size={14} />
                  </button>
                  <RowActions onEdit={() => setEditing(c)} onDelete={() => setDeleting(c)} />
                </div>
              </td>
            </tr>
          ))}
        />
      )}

      {editing && <ClienteForm initial={editing} onSave={save} onClose={() => setEditing(null)} statusClientes={statusClientes} />}
      {deleting && (
        <ConfirmDelete label={`o cliente "${deleting.nome}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

// Envia o portfólio (ou qualquer mensagem) pra lista de clientes, um de
// cada vez, direto pelo WhatsApp — o WhatsApp não permite disparo em massa
// automático, então cada envio abre uma conversa e a pessoa confirma o
// clique manualmente, como o próprio WhatsApp exige.
const MENSAGEM_DIVULGACAO_PADRAO =
  () => `Olá! Aqui é da ${PREFS_ATUAL_REF?.nomeEmpresa || "nossa empresa"} 🚛🏗️. Trabalhamos com concreto usinado de alta qualidade, entregue direto na sua obra, com FCK sob medida pro seu projeto. Confira nosso portfólio:\n{link}\n\nQualquer dúvida ou orçamento, é só chamar!`;

function DivulgacaoModule({ clientes, prefs, onPrefsChanged, galeria, onChangeGaleria }) {
  const [subTab, setSubTab] = useState("mensagem");
  const [linkPortfolio, setLinkPortfolio] = useState(prefs.linkPortfolio || "");
  const [mensagem, setMensagem] = useState(prefs.mensagemDivulgacao || MENSAGEM_DIVULGACAO_PADRAO());
  const [busca, setBusca] = useState("");
  const [enviados, setEnviados] = useState(() => new Set(prefs.divulgacaoEnviados || []));
  const [selecionados, setSelecionados] = useState(new Set());
  const [fila, setFila] = useState(null); // null | { lista: [...clientes], indice: 0 }

  const salvarConfig = (camposExtras = {}) => {
    onPrefsChanged({ ...prefs, linkPortfolio, mensagemDivulgacao: mensagem, ...camposExtras });
  };

  const clientesComTelefone = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return clientes
      .filter((c) => c.telefone)
      .filter((c) => !q || c.nome?.toLowerCase().includes(q) || c.empresa?.toLowerCase().includes(q))
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));
  }, [clientes, busca]);

  const marcarEnviado = (clienteId) => {
    const novosEnviados = new Set(enviados);
    novosEnviados.add(clienteId);
    setEnviados(novosEnviados);
    salvarConfig({ divulgacaoEnviados: [...novosEnviados] });
  };

  const abrirWhatsapp = (cliente) => {
    const texto = mensagem.replaceAll("{link}", linkPortfolio || "");
    const limpo = (cliente.telefone || "").replace(/\D/g, "");
    if (!limpo) return;
    const numeroFinal = limpo.startsWith("55") ? limpo : `55${limpo}`;
    window.open(`https://wa.me/${numeroFinal}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const enviar = (cliente) => {
    abrirWhatsapp(cliente);
    marcarEnviado(cliente.id);
  };

  const toggleSelecionado = (id) => {
    setSelecionados((s) => {
      const novo = new Set(s);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  };

  const selecionarTodosVisiveis = () => {
    setSelecionados((s) => {
      const novo = new Set(s);
      clientesComTelefone.forEach((c) => novo.add(c.id));
      return novo;
    });
  };

  const iniciarFila = () => {
    const lista = clientesComTelefone.filter((c) => selecionados.has(c.id));
    if (lista.length === 0) return;
    setFila({ lista, indice: 0 });
  };

  const enviarDaFilaEAvancar = () => {
    const atual = fila.lista[fila.indice];
    abrirWhatsapp(atual);
    marcarEnviado(atual.id);
    if (fila.indice + 1 < fila.lista.length) {
      setFila({ ...fila, indice: fila.indice + 1 });
    } else {
      setFila(null);
      setSelecionados(new Set());
    }
  };

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Marketing" title="Divulgação" />
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "-14px", marginBottom: "20px", maxWidth: "560px" }}>
        Manda o portfólio pra sua lista de clientes pelo WhatsApp. Marca vários e manda numa fila rápida — o WhatsApp não deixa abrir tudo de uma vez (é assim pra evitar spam), então cada clique já abre o próximo.
      </p>

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "4px" }}>
        {[
          { id: "mensagem", label: "Mensagem e envio" },
          { id: "galeria", label: `Galeria (${galeria.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className="tl-focus"
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "13.5px",
              fontWeight: 600,
              background: subTab === t.id ? "var(--accent)" : "transparent",
              color: subTab === t.id ? "var(--accent-text)" : "var(--text-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "galeria" ? (
        <GaleriaDivulgacaoSection galeria={galeria} onChange={onChangeGaleria} />
      ) : (
        <>
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "10px", padding: "18px", marginBottom: "20px" }}>
        <Field label="Link do portfólio" hint="Cole aqui o link do Google Drive, site, etc.">
          <Input value={linkPortfolio} onChange={(e) => setLinkPortfolio(e.target.value)} onBlur={() => salvarConfig()} placeholder="https://drive.google.com/..." />
        </Field>
        <Field label="Mensagem" hint='Onde escrever "{link}" no texto, o link acima entra sozinho'>
          <TextArea value={mensagem} onChange={(e) => setMensagem(e.target.value)} onBlur={() => salvarConfig()} rows={5} />
        </Field>
      </div>

      {fila && (
        <div style={{ background: "#1F3A2E", border: "1px solid #2C4F3D", borderRadius: "10px", padding: "18px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <strong style={{ color: "#6FCF97", fontSize: "13px" }}>Enviando {fila.indice + 1} de {fila.lista.length}</strong>
            <button onClick={() => setFila(null)} className="tl-focus" style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}>
              Parar
            </button>
          </div>
          <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{fila.lista[fila.indice].nome}</div>
          <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "14px" }} className="tl-mono">{fila.lista[fila.indice].telefone}</div>
          <Button onClick={enviarDaFilaEAvancar} icon={MessageCircle} style={{ width: "100%", justifyContent: "center" }}>
            {fila.indice + 1 < fila.lista.length ? "Enviar e ir pro próximo" : "Enviar (último)"}
          </Button>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", maxWidth: "320px", flex: 1, minWidth: "220px" }}>
          <Search size={15} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <Input placeholder="Buscar cliente ou empresa" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ paddingLeft: "32px" }} />
        </div>
        <Button variant="ghost" size="sm" onClick={selecionarTodosVisiveis}>Selecionar todos</Button>
        {selecionados.size > 0 && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setSelecionados(new Set())}>Limpar seleção</Button>
            <Button size="sm" icon={Send} onClick={iniciarFila}>Enviar pra {selecionados.size} selecionado{selecionados.size === 1 ? "" : "s"}</Button>
          </>
        )}
      </div>

      {clientesComTelefone.length === 0 ? (
        <EmptyState icon={Megaphone} title="Nenhum cliente com telefone encontrado" hint="Cadastre o telefone dos clientes pra poder enviar." />
      ) : (
        <Table
          columns={["", "Cliente", "Telefone", ""]}
          rows={clientesComTelefone.map((c) => (
            <tr key={c.id} style={rowStyle}>
              <td style={tdStyle}>
                <input type="checkbox" checked={selecionados.has(c.id)} onChange={() => toggleSelecionado(c.id)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
              </td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>
                {c.nome}
                {c.empresa && <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 400 }}>{c.empresa}</div>}
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }} className="tl-mono">{c.telefone}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <button
                  onClick={() => enviar(c)}
                  className="tl-focus"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: enviados.has(c.id) ? "var(--bg-panel-raised)" : "#1F3A2E",
                    color: enviados.has(c.id) ? "var(--text-muted)" : "#6FCF97",
                    border: enviados.has(c.id) ? "1px solid var(--border-soft)" : "1px solid #2C4F3D",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {enviados.has(c.id) ? <Check size={13} /> : <MessageCircle size={13} />}
                  {enviados.has(c.id) ? "Enviado" : "Enviar"}
                </button>
              </td>
            </tr>
          ))}
        />
      )}
        </>
      )}
    </div>
  );
}

// Galeria de fotos pra divulgação — guarda cada foto separadamente (não
// tudo num documento só), pra nunca esbarrar no limite de tamanho do
// banco de dados mesmo com várias fotos guardadas.
function GaleriaDivulgacaoSection({ galeria, onChange }) {
  const [enviando, setEnviando] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [viewingSrc, setViewingSrc] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef(null);

  const handleFiles = async (fileList) => {
    setEnviando(true);
    const novas = [];
    for (const file of Array.from(fileList)) {
      try {
        const dataUrl = await compressImage(file);
        const id = uid();
        const ok = await savePhotoBlob(id, dataUrl);
        if (ok) novas.push({ id, nome: file.name, criadoEm: new Date().toISOString() });
      } catch (e) {
        console.error("Falha ao processar foto", e);
      }
    }
    onChange([...novas, ...galeria]);
    setEnviando(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    if (viewing) {
      loadPhotoBlob(viewing.id).then(setViewingSrc);
    } else {
      setViewingSrc(null);
    }
  }, [viewing]);

  const baixarFoto = async (foto) => {
    const src = await loadPhotoBlob(foto.id);
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = foto.nome || `foto-${foto.id}.jpg`;
    a.click();
  };

  const excluirFoto = async (foto) => {
    await deletePhotoBlob(foto.id);
    onChange(galeria.filter((f) => f.id !== foto.id));
    setDeleting(null);
    setViewing(null);
  };

  return (
    <div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Guarde aqui as fotos que você usa pra divulgar (equipamentos, obras, etc.). Pra mandar pro cliente: abre a foto, clica em "Baixar", e anexa manualmente no WhatsApp — o WhatsApp não deixa anexar direto por um botão daqui.
      </p>

      <label
        className="tl-focus"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--accent)",
          color: "var(--accent-text)",
          borderRadius: "6px",
          padding: "9px 16px",
          fontSize: "13.5px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        <Upload size={15} />
        {enviando ? "Enviando..." : "Adicionar fotos"}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          disabled={enviando}
          onChange={(e) => e.target.files.length > 0 && handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
      </label>

      {galeria.length === 0 ? (
        <EmptyState icon={Camera} title="Nenhuma foto na galeria ainda" hint="Clica em 'Adicionar fotos' pra subir as primeiras." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
          {galeria.map((foto) => (
            <div key={foto.id} style={{ position: "relative", border: "1px solid var(--border-soft)", borderRadius: "8px", overflow: "hidden", background: "var(--bg-panel)" }}>
              <button
                onClick={() => setViewing(foto)}
                className="tl-focus"
                style={{ display: "block", width: "100%", padding: 0, border: "none", cursor: "pointer", background: "none" }}
              >
                <FotoVisualGrande id={foto.id} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleting(foto); }}
                className="tl-focus"
                title="Excluir foto"
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(20,20,20,0.75)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {viewing && (
        <Modal title={viewing.nome || "Foto"} onClose={() => setViewing(null)}>
          {viewingSrc ? (
            <img src={viewingSrc} alt="" style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: "8px", background: "#111" }} />
          ) : (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Loader2 size={18} style={{ color: "var(--text-faint)" }} />
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <button
              onClick={() => setDeleting(viewing)}
              className="tl-focus"
              style={{ background: "none", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "8px 14px", color: "var(--danger)", fontSize: "13px", cursor: "pointer" }}
            >
              Excluir
            </button>
            <Button icon={Download} onClick={() => baixarFoto(viewing)}>Baixar</Button>
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDelete label={`a foto "${deleting.nome || "sem nome"}"`} dados={deleting} onConfirm={() => excluirFoto(deleting)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}



function ClienteForm({ initial, onSave, onClose, statusClientes }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const [obraAberta, setObraAberta] = useState(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepEntrega, setCepEntrega] = useState("");
  const [buscandoCepEntrega, setBuscandoCepEntrega] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    salvarRascunho("cliente", form);
  }, [form]);

  const buscarCep = async (cepDigitado) => {
    const limpo = (cepDigitado || "").replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const dados = await resp.json();
      if (!dados.erro) {
        setForm((f) => ({
          ...f,
          endereco: dados.logradouro || f.endereco,
          bairro: dados.bairro || f.bairro,
          municipio: dados.localidade || f.municipio,
          uf: dados.uf || f.uf,
        }));
      }
    } catch (e) {
      /* sem internet ou serviço fora do ar — segue com preenchimento manual */
    }
    setBuscandoCep(false);
  };

  // Igual à busca de CEP da cobrança acima, mas escreve o resultado direto
  // como uma linha de texto pronta dentro de "Endereço de Entrega" — já que
  // esse campo é livre (obra pode não ter número/CEP formal cadastrável).
  const buscarCepEntrega = async (cepDigitado) => {
    const limpo = (cepDigitado || "").replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setBuscandoCepEntrega(true);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const dados = await resp.json();
      if (!dados.erro) {
        const linha = [dados.logradouro, dados.bairro, dados.localidade && dados.uf ? `${dados.localidade}/${dados.uf}` : "", `CEP ${cepDigitado}`].filter(Boolean).join(" — ");
        setForm((f) => ({ ...f, enderecoEntrega: linha }));
      }
    } catch (e) {
      /* sem internet ou serviço fora do ar — segue com preenchimento manual */
    }
    setBuscandoCepEntrega(false);
  };

  return (
    <Modal title={initial.nome ? "Editar cliente" : "Novo cliente"} onClose={() => { limparRascunho("cliente"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}
      {initial.nome && (form.telefone || form.email) && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {form.telefone && (
            <button
              type="button"
              onClick={() => {
                const limpo = form.telefone.replace(/\D/g, "");
                if (!limpo) return;
                const numeroFinal = limpo.startsWith("55") ? limpo : `55${limpo}`;
                window.open(`https://wa.me/${numeroFinal}`, "_blank");
              }}
              className="tl-focus"
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1F3A2E", color: "#6FCF97", border: "1px solid #2C4F3D", borderRadius: "6px", padding: "7px 13px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              <MessageCircle size={15} /> WhatsApp
            </button>
          )}
          {form.email && (
            <a
              href={`mailto:${form.email}`}
              className="tl-focus"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--bg-panel-raised)", color: "var(--text-primary)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "7px 13px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
            >
              <Mail size={15} /> E-mail
            </a>
          )}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          limparRascunho("cliente");
          onSave(form);
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 16px" }}>
          <Field label="Nº do pedido" required hint="Sugerido automaticamente — pode alterar se precisar">
            <Input value={form.pedido} onChange={set("pedido")} required />
          </Field>
          <Field label="Nome completo" required>
            <Input value={form.nome} onChange={set("nome")} required />
          </Field>
        </div>
        <Field label="Empresa" hint="Opcional — preenche quando o pedido for de uma empresa, não de pessoa física">
          <Input value={form.empresa} onChange={set("empresa")} placeholder="Ex: CH Engenharia" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="CPF / CNPJ">
            <Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatarCpfCnpj(e.target.value) })} placeholder="000.000.000-00" />
          </Field>
          <Field label="Telefone">
            <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: formatarTelefone(e.target.value) })} placeholder="(00) 00000-0000" />
          </Field>
        </div>
        <Field label="E-mail">
          <Input type="email" value={form.email} onChange={set("email")} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 16px" }}>
          <Field label="CEP" hint={buscandoCep ? "Buscando endereço..." : "Preenche rua e bairro automaticamente"}>
            <Input
              value={form.cep}
              onChange={(e) => {
                const cep = formatarCep(e.target.value);
                setForm({ ...form, cep });
                if (cep.replace(/\D/g, "").length === 8) buscarCep(cep);
              }}
              placeholder="00000-000"
            />
          </Field>
          <Field label="Endereço de Cobrança (rua)">
            <Input value={form.endereco} onChange={set("endereco")} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "0 16px" }}>
          <Field label="Número">
            <Input value={form.numero} onChange={set("numero")} />
          </Field>
          <Field label="Bairro">
            <Input value={form.bairro} onChange={set("bairro")} />
          </Field>
          <Field label="Complemento">
            <Input value={form.complemento} onChange={set("complemento")} placeholder="Apto, bloco, referência..." />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 1.3fr", gap: "0 16px" }}>
          <Field label="Município" hint="Preenche sozinho pelo CEP — pode corrigir se precisar">
            <Input value={form.municipio} onChange={set("municipio")} />
          </Field>
          <Field label="UF">
            <Input value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase().slice(0, 2) })} placeholder="SP" />
          </Field>
          <Field label="Inscrição Estadual" hint="Opcional — aparece na Ordem de Serviço">
            <Input value={form.inscricaoEstadual} onChange={set("inscricaoEstadual")} />
          </Field>
        </div>

        <Field label="Endereço de Entrega" hint="Deixa em branco se for igual ao endereço de cobrança acima (ex: local da obra)">
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
            <Input
              value={cepEntrega}
              onChange={(e) => {
                const cep = formatarCep(e.target.value);
                setCepEntrega(cep);
                if (cep.replace(/\D/g, "").length === 8) buscarCepEntrega(cep);
              }}
              placeholder="CEP da obra (00000-000)"
              style={{ maxWidth: "160px" }}
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, enderecoEntrega: enderecoCompleto(form) })}
              className="tl-focus"
              style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "12.5px", textDecoration: "underline", cursor: "pointer", padding: "8px 0" }}
            >
              Usar o mesmo endereço de cobrança
            </button>
            {buscandoCepEntrega && <span style={{ fontSize: "11.5px", color: "var(--text-faint)", alignSelf: "center" }}>Buscando...</span>}
          </div>
          <Input value={form.enderecoEntrega} onChange={set("enderecoEntrega")} placeholder="Ex: Rua da Obra, 123 - Bairro X" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 16px" }}>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              {[...new Set([form.status, ...(statusClientes || []).map((s) => s.nome)].filter(Boolean))].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Observação">
            <Input value={form.observacao} onChange={set("observacao")} />
          </Field>
        </div>

        <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Obras desse cliente</span>
          <Button
            type="button"
            size="sm"
            variant="subtle"
            icon={Plus}
            onClick={() => { setObraAberta((form.obras || []).length); setForm({ ...form, obras: [...(form.obras || []), emptyObra()] }); }}
          >
            Obra
          </Button>
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-faint)", marginBottom: "10px" }}>
          Um cliente pode ter várias obras — cada uma com seu próprio endereço e responsável. O endereço da obra fica disponível sozinho na agenda e na ordem de serviço.
        </p>
        {(form.obras || []).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
            {(form.obras || []).map((o, i) => {
              const aberta = obraAberta === i;
              const setObra = (k, v) => setForm({ ...form, obras: form.obras.map((it) => (it.id === o.id ? { ...it, [k]: v } : it)) });
              return (
                <div key={o.id} style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "8px", overflow: "hidden" }}>
                  <div
                    onClick={() => setObraAberta(aberta ? null : i)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <ChevronRight size={14} style={{ color: "var(--text-faint)", flexShrink: 0, transform: aberta ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                      <span style={{ fontSize: "12.5px", fontWeight: 700 }}>{o.nome || `Obra ${i + 1}`}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.endereco || "sem endereço ainda"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setForm({ ...form, obras: form.obras.filter((it) => it.id !== o.id) }); setObraAberta(null); }}
                      className="tl-focus"
                      style={{ ...iconBtnStyle, color: "var(--danger)" }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                  {aberta && (
                    <div style={{ padding: "0 10px 12px 10px" }}>
                      <Field label="Nome da obra">
                        <Input value={o.nome} onChange={(e) => setObra("nome", e.target.value)} />
                      </Field>
                      <Field label="Endereço completo">
                        <Input value={o.endereco} onChange={(e) => setObra("endereco", e.target.value)} />
                      </Field>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 8px" }}>
                        <Field label="Número">
                          <Input value={o.numero} onChange={(e) => setObra("numero", e.target.value)} />
                        </Field>
                        <Field label="Bairro">
                          <Input value={o.bairro} onChange={(e) => setObra("bairro", e.target.value)} />
                        </Field>
                        <Field label="CEP">
                          <Input value={o.cep} onChange={(e) => setObra("cep", e.target.value)} />
                        </Field>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                        <Field label="Cidade">
                          <Input value={o.cidade} onChange={(e) => setObra("cidade", e.target.value)} />
                        </Field>
                        <Field label="Estado">
                          <Input value={o.uf} onChange={(e) => setObra("uf", e.target.value)} maxLength={2} />
                        </Field>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                        <Field label="Responsável pela obra">
                          <Input value={o.responsavel} onChange={(e) => setObra("responsavel", e.target.value)} />
                        </Field>
                        <Field label="Telefone do responsável">
                          <Input value={o.telefoneResponsavel} onChange={(e) => setObra("telefoneResponsavel", e.target.value)} />
                        </Field>
                      </div>
                      <Field label="Observações">
                        <Input value={o.observacao} onChange={(e) => setObra("observacao", e.target.value)} />
                      </Field>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("cliente"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar cliente</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Table helpers                                                       */
/* ------------------------------------------------------------------ */
const rowStyle = { borderBottom: "1px solid var(--border-soft)" };
const tdStyle = { padding: "11px 14px", fontSize: "13.5px", verticalAlign: "middle" };

function Table({ columns, rows }) {
  return (
    <div
      className="tl-scrollbar"
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-soft)",
        borderRadius: "9px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <table style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg-hatch)", borderBottom: "1px solid var(--border)" }}>
            {columns.map((c, i) => (
              <th
                key={i}
                className="tl-mono"
                style={{
                  textAlign: i === columns.length - 1 ? "right" : "left",
                  padding: "10px 14px",
                  fontSize: "10.5px",
                  letterSpacing: "0.06em",
                  color: "var(--text-faint)",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div style={{ display: "inline-flex", gap: "4px" }}>
      <button onClick={onEdit} className="tl-focus" style={iconBtnStyle} title="Editar">
        <Pencil size={14} />
      </button>
      <button onClick={onDelete} className="tl-focus" style={{ ...iconBtnStyle, color: "var(--danger)" }} title="Excluir">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
const iconBtnStyle = {
  background: "var(--bg-panel-raised)",
  border: "1px solid var(--border)",
  borderRadius: "5px",
  padding: "6px",
  color: "var(--text-muted)",
  cursor: "pointer",
  display: "inline-flex",
};

/* ------------------------------------------------------------------ */
/*  Produção module                                                     */
/* ------------------------------------------------------------------ */
const emptyProducao = () => ({
  id: uid(),
  pedido: "",
  pedidoCliente: "", // número do pedido/nota do lado do cliente, se houver
  data: "",
  horario: "", // hora prevista de carregamento, pra ordenar a Programação Diária
  equipamento: "", // combinação FCK + Brita, montada automaticamente ao salvar
  fck: "",
  brita: "",
  slump: "",
  peca: "", // tipo de elemento: laje, piso, base, calçada, etc.
  qtdDias: 1, // usado como "Metro cúbico" na tela
  valorDiaria: "", // usado como "Valor metro cúbico" na tela
  frete: "", // usado como "Bomba" na tela
  operador: "", // preenchido automaticamente com o motorista
  motorista: "",
  placa: "",
  vendedor: "",
  status: "EM ABERTO",
  total: 0,
  metragem: "",
  viagens: [],
  formaPagamento: "", // obrigatório quando status = PAGO
  valorPago: "", // se for menor que o total, é pagamento parcial
  dataProximoPagamento: "", // obrigatório se o pagamento ficou parcial
});
const emptyViagem = () => ({ id: uid(), horario: "", placa: "", motorista: "", volume: "", sobra: "", sobraDestinoPedido: "", lacre: "", valorBomba: "", numeroBomba: "", descricao: "", valor: "" });

function ProducaoModule({ title, icon, tipo, equipamentos, records, seedRecords, clienteByPedido, operadores, vendedores, motoristas, caminhoes, empresasRetirada, propostas, todasProducaoEsc, todasProducaoPerf, financeiro, ticks, onChange, onGerarProposta }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [busca, setBusca] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("data-recente");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroEquipamento, setFiltroEquipamento] = useState("todos");
  const [somenteZerados, setSomenteZerados] = useState(false);
  const [pedidoRelatorioGeral, setPedidoRelatorioGeral] = useState("");
  const [verRelatorioGeral, setVerRelatorioGeral] = useState(null);
  const [verProgramacaoDiaria, setVerProgramacaoDiaria] = useState(false);
  const isPerfuratriz = tipo === "Perfuratriz";
  const isEscavadeira = tipo === "Escavadeira";

  const equipamentosUsados = useMemo(
    () => [...new Set(records.map((r) => r.equipamento).filter(Boolean))].sort(),
    [records]
  );
  const statusUsados = useMemo(() => {
    const mapa = new Map(); // versão em MAIÚSCULO -> primeira grafia encontrada
    records.forEach((r) => {
      if (!r.status) return;
      const chave = r.status.trim().toUpperCase();
      if (!mapa.has(chave)) mapa.set(chave, r.status.trim());
    });
    return [...mapa.values()].sort();
  }, [records]);

  const registrosFiltradosVisiveis = useMemo(() => {
    return [...records]
      .filter((r) => {
        const q = busca.trim().toLowerCase();
        if (q && !String(r.pedido).toLowerCase().includes(q) && !String(r.cliente || "").toLowerCase().includes(q)) return false;
        if (filtroEquipamento !== "todos" && r.equipamento !== filtroEquipamento) return false;
        if (filtroStatus !== "todos" && String(r.status || "").trim().toUpperCase() !== filtroStatus.toUpperCase()) return false;
        if (somenteZerados && numeroSeguro(r.total) !== 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (ordenarPor === "data-antiga") return dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data));
        if (ordenarPor === "pedido") return (parseInt(b.pedido, 10) || 0) - (parseInt(a.pedido, 10) || 0);
        if (ordenarPor === "cliente") return String(a.cliente || "").localeCompare(String(b.cliente || ""));
        return dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data));
      });
  }, [records, busca, filtroEquipamento, filtroStatus, somenteZerados, ordenarPor]);

  const semCliente = records.filter((r) => !r.cliente || r.cliente === "-").length;

  const restaurarClientes = () => {
    const seedByPedido = new Map();
    (seedRecords || []).forEach((s) => {
      if (s.pedido && s.cliente && s.cliente !== "-") seedByPedido.set(String(s.pedido).trim(), s);
    });
    const corrigidos = records.map((r) => {
      if (r.cliente && r.cliente !== "-") return r;
      const cadastro = clienteByPedido.get(String(r.pedido).trim());
      if (cadastro) return { ...r, cliente: cadastro.nome, endereco: cadastro.endereco || r.endereco };
      const seed = seedByPedido.get(String(r.pedido).trim());
      if (seed) return { ...r, cliente: seed.cliente, endereco: seed.endereco || r.endereco };
      return r;
    });
    onChange(corrigidos);
  };

  const save = (record) => {
    const cliente = clienteByPedido.get(String(record.pedido).trim());
    const comCargas = recalcularComCargas(record);
    const enriched = {
      ...comCargas,
      // Só sobrescreve cliente/endereço quando há um cadastro correspondente em Clientes.
      // Sem isso, editar um pedido antigo sem cadastro formal apagaria o nome já salvo.
      cliente: cliente ? cliente.nome : (record.cliente || "-"),
      endereco: cliente ? cliente.endereco : (record.endereco || "-"),
    };
    const exists = records.some((r) => r.id === record.id);
    onChange(exists ? records.map((r) => (r.id === record.id ? enriched : r)) : [...records, enriched]);
    setEditing(null);
  };

  const remove = (id) => {
    onChange(records.filter((r) => r.id !== id));
    setDeleting(null);
  };

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Produção"
        title={title}
        action={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="subtle" icon={Printer} onClick={() => setVerProgramacaoDiaria(true)}>Programação Diária</Button>
            <Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("producao", emptyProducao))}>Novo lançamento</Button>
          </div>
        }
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
          flexWrap: "wrap",
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "9px",
          padding: "14px 16px",
          marginBottom: "18px",
        }}
      >
        <Field label="Relatório geral por pedido" hint="Reúne cliente, produção, proposta e financeiro desse número">
          <Input value={pedidoRelatorioGeral} onChange={(e) => setPedidoRelatorioGeral(e.target.value)} placeholder="Ex: 620" style={{ width: "160px" }} />
        </Field>
        <Button
          icon={FileText}
          variant="subtle"
          disabled={!pedidoRelatorioGeral.trim()}
          onClick={() => setVerRelatorioGeral(pedidoRelatorioGeral.trim())}
        >
          Gerar relatório
        </Button>
      </div>

      {semCliente > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            background: "#3A2F13",
            border: "1px solid #5A4A1F",
            borderRadius: "7px",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          <span style={{ color: "#E8A63D" }}>
            {semCliente} pedido{semCliente > 1 ? "s" : ""} sem nome de cliente exibido.
          </span>
          <Button size="sm" variant="subtle" onClick={restaurarClientes}>Restaurar clientes</Button>
        </div>
      )}

      {records.length === 0 ? (
        <EmptyState icon={icon} title="Nenhum lançamento ainda" hint="Digite o número do pedido e o cliente é preenchido automaticamente." />
      ) : (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <Search size={15} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              <Input placeholder="Buscar por pedido ou cliente" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ paddingLeft: "32px" }} />
            </div>
            <Select value={filtroEquipamento} onChange={(e) => setFiltroEquipamento(e.target.value)} style={{ width: "190px" }}>
              <option value="todos">Todo equipamento</option>
              {equipamentosUsados.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </Select>
            <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: "160px" }}>
              <option value="todos">Todo status</option>
              {statusUsados.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </Select>
            <Select value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)} style={{ width: "220px" }}>
              <option value="data-recente">Data (mais recente primeiro)</option>
              <option value="data-antiga">Data (mais antiga primeiro)</option>
              <option value="pedido">Nº do pedido</option>
              <option value="cliente">Nome do cliente</option>
            </Select>
            <Button
              size="sm"
              variant={somenteZerados ? "primary" : "subtle"}
              onClick={() => setSomenteZerados(!somenteZerados)}
              type="button"
            >
              {somenteZerados ? "✓ " : ""}Só valor zerado ({records.filter((r) => numeroSeguro(r.total) === 0).length})
            </Button>
          </div>

          {somenteZerados && registrosFiltradosVisiveis.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                background: "#3A2F13",
                border: "1px solid #5A4A1F",
                borderRadius: "7px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "#E8A63D" }}>
                {registrosFiltradosVisiveis.length} lançamento(s) com valor zerado nessa lista.
              </span>
              <Button
                size="sm"
                variant="subtle"
                icon={Trash2}
                onClick={() => {
                  if (window.confirm(`Excluir os ${registrosFiltradosVisiveis.length} lançamentos zerados listados agora? Depois é só reimportar a planilha que eles voltam com o valor certo.`)) {
                    const idsExcluir = new Set(registrosFiltradosVisiveis.map((r) => r.id));
                    onChange(records.filter((r) => !idsExcluir.has(r.id)));
                  }
                }}
              >
                Excluir estes {registrosFiltradosVisiveis.length}
              </Button>
            </div>
          )}

          <Table
          columns={["Pedido", "Cliente", "Data", "Equipamento", "Total", "Status", ""]}
          rows={registrosFiltradosVisiveis
            .map((r) => (
            <tr key={r.id} style={rowStyle}>
              <td style={tdStyle}><PedidoStub n={r.pedido} /></td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{r.cliente || "-"}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.equipamento || "-"}</td>
              <td style={{ ...tdStyle }} className="tl-mono">{money(r.total)}</td>
              <td style={tdStyle}><StatusBadge status={r.status} /></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <div style={{ display: "inline-flex", gap: "4px" }}>
                  <button onClick={() => setViewing(r)} className="tl-focus" style={iconBtnStyle} title="Ver relatório do pedido">
                    <Eye size={14} />
                  </button>
                  <RowActions onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />
                </div>
              </td>
            </tr>
          ))}
          />
        </>
      )}

      {editing && (
        <ProducaoForm
          initial={editing}
          equipamentos={equipamentos}
          isPerfuratriz={isPerfuratriz}
          isEscavadeira={isEscavadeira}
          clienteByPedido={clienteByPedido}
          operadores={operadores}
          vendedores={vendedores}
          motoristas={motoristas}
          caminhoes={caminhoes}
          empresasRetirada={empresasRetirada}
          propostas={propostas}
          ticks={ticks}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {viewing && (
        <PedidoReport
          record={viewing}
          isPerfuratriz={isPerfuratriz}
          isEscavadeira={isEscavadeira}
          cliente={clienteByPedido.get(String(viewing.pedido).trim())}
          onClose={() => setViewing(null)}
          onGerarProposta={() => {
            setViewing(null);
            onGerarProposta(viewing);
          }}
        />
      )}
      {deleting && (
        <ConfirmDelete label={`o pedido nº ${deleting.pedido}`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
      {verRelatorioGeral && (
        <RelatorioGeralPedido
          pedido={verRelatorioGeral}
          cliente={clienteByPedido.get(verRelatorioGeral)}
          producaoEsc={todasProducaoEsc}
          producaoPerf={todasProducaoPerf}
          propostas={propostas}
          financeiro={financeiro}
          onClose={() => setVerRelatorioGeral(null)}
        />
      )}
      {verProgramacaoDiaria && (
        <ProgramacaoDiariaModal records={records} clienteByPedido={clienteByPedido} onClose={() => setVerProgramacaoDiaria(false)} />
      )}
    </div>
  );
}

// Relatório de expedição do dia — o formato que a balança usa pra saber o
// que carregar em cada caminhão: horário, cliente, endereço, m³, FCK/Brita/
// Slump, valor, vendedor e peça. Pensado pra imprimir.
function ProgramacaoDiariaModal({ records, clienteByPedido, onClose }) {
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const doDia = useMemo(() => {
    return (records || [])
      .filter((r) => r.data === data)
      .sort((a, b) => (a.horario || "").localeCompare(b.horario || ""));
  }, [records, data]);

  const totalM3 = doDia.reduce((s, r) => s + (Number(r.qtdDias) || 0), 0);
  const dataFormatada = data ? new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR") : "";

  return (
    <Modal title="Programação Diária" onClose={onClose} wide>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
        <Field label="Data">
          <Input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{ width: "180px" }} />
        </Field>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>

      <div id="programacao-diaria-imprimir" className="tl-print-area">
        <div style={{ textAlign: "center", marginBottom: "16px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
          <div style={{ fontWeight: 800, fontSize: "16px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>EXPEDIÇÃO :: TODAS PARA {dataFormatada}</div>
        </div>

        {doDia.length === 0 ? (
          <EmptyState icon={Truck} title="Nenhum lançamento nessa data" hint="Escolhe outra data acima, ou lança a produção do dia primeiro." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {doDia.map((r, i) => {
              const cliente = clienteByPedido.get(String(r.pedido).trim());
              return (
                <div key={r.id} style={{ padding: "12px 4px", borderBottom: "1px solid #ccc", fontSize: "12.5px" }}>
                  <div style={{ fontWeight: 700, marginBottom: "4px" }}>{r.horario || "--:--"}</div>
                  <div><strong>CLIENTE</strong> &nbsp; {cliente ? cliente.nome : r.cliente || "-"} {r.pedido ? `- ${r.pedido}` : ""}</div>
                  <div><strong>ENDEREÇO</strong> &nbsp; {cliente ? enderecoCompleto(cliente) : r.endereco || "-"}</div>
                  <div>
                    <strong>m3</strong> &nbsp; {r.qtdDias || "-"}
                    {"     "}
                    {[r.fck, r.brita, r.slump ? `SLUMP ${r.slump}` : ""].filter(Boolean).join(" - ")}
                  </div>
                  <div>
                    <strong>VALOR UNIT</strong> &nbsp; {money(r.valorDiaria)}
                    {r.pedidoCliente ? `     Pedido ${r.pedidoCliente}` : ""}
                  </div>
                  <div><strong>VENDEDOR</strong> &nbsp; {r.vendedor || "-"}</div>
                  <div><strong>BOMBISTA</strong> &nbsp; {numeroSeguro(r.frete) > 0 ? "BOMBA" : "CONVENCIONAL"}</div>
                  <div><strong>PEÇA</strong> &nbsp; {r.peca || ""}</div>
                </div>
              );
            })}
            <div style={{ padding: "14px 4px", fontWeight: 700, fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
              <span>{doDia.length} registro(s)</span>
              <span>Total para {dataFormatada} &nbsp; {totalM3.toFixed(1)} m³</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
function RelatorioGeralPedido({ pedido, cliente, producaoEsc, propostas, financeiro, onClose }) {
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [aviso, setAviso] = useState("");

  const lancamentosEsc = (producaoEsc || []).filter((r) => String(r.pedido).trim() === pedido);
  const propostasPedido = (propostas || []).filter((p) => String(p.pedido).trim() === pedido);
  const contasPedido = (financeiro || []).filter((c) => String(c.pedido).trim() === pedido);

  const totalEsc = lancamentosEsc.reduce((s, r) => s + numeroSeguro(r.total), 0);
  const totalPropostas = propostasPedido.reduce((s, p) => s + p.itens.reduce((s2, it) => s2 + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0), 0);
  const totalGeral = totalEsc;

  const enviar = async () => {
    setGerandoPdf(true);
    setAviso("");
    const blob = await gerarPdfRelatorioGeral(pedido, cliente, lancamentosEsc, propostasPedido, contasPedido, totalGeral);
    setGerandoPdf(false);

    const texto =
      `*Relatório Geral — Pedido nº ${pedido}*\n\n` +
      (cliente ? `Cliente: ${cliente.nome}\n` : "") +
      `Lançamentos: ${lancamentosEsc.length}\n` +
      `Total: ${money(totalGeral)}\n\n${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;

    let telefone = (cliente?.telefone || "").replace(/\D/g, "");
    const abrirTextoSimples = () => {
      if (!telefone) {
        const digitado = window.prompt("Cliente sem telefone cadastrado. Digite o número (com DDD):", "");
        telefone = (digitado || "").replace(/\D/g, "");
        if (!telefone) return;
      }
      const numeroFinal = telefone.startsWith("55") ? telefone : `55${telefone}`;
      window.open(`https://wa.me/${numeroFinal}?text=${encodeURIComponent(texto)}`, "_blank");
    };

    if (!blob) {
      setAviso("Geração de PDF não disponível nesta pré-visualização — enviando como texto. No site publicado, este botão manda o documento com a logo.");
      abrirTextoSimples();
      return;
    }

    const fileName = `relatorio-geral-pedido-${pedido}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (ehCelular && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Relatório - Pedido ${pedido}`, text: `Relatório Geral - ${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}` });
        return;
      } catch (e) {
        /* segue pro download abaixo */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.alert(`PDF baixado como "${fileName}" (confira a pasta Downloads).\n\nO WhatsApp vai abrir agora só com o texto — anexe esse arquivo baixado na conversa antes de enviar.`);
    abrirTextoSimples();
    setAviso("PDF baixado e WhatsApp aberto — é só anexar o arquivo baixado na conversa.");
  };

  return (
    <Modal title={`Relatório geral — Pedido nº ${pedido}`} onClose={onClose} wide>
      <div className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", borderRadius: "6px", padding: "28px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #1a1a1a", paddingBottom: "14px", marginBottom: "20px" }}>
          <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", borderRadius: "6px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "19px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{[PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" — ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px" }}>RELATÓRIO GERAL</div>
            <div style={{ fontSize: "11px", color: "#555" }}>Pedido nº {pedido}</div>
          </div>
        </div>

        {cliente && (
          <div style={{ marginBottom: "18px", fontSize: "13px" }}>
            <strong>Cliente:</strong> {cliente.nome} · <strong>Telefone:</strong> {cliente.telefone || "-"} · <strong>Endereço:</strong> {cliente.endereco || "-"}
          </div>
        )}

        {lancamentosEsc.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <strong style={{ fontSize: "13.5px" }}>Produção Concreto ({lancamentosEsc.length})</strong>
            {lancamentosEsc.map((r) => (
              <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
                <ReportRow label={`${fmtDate(r.data)} — ${r.equipamento || "-"}`} value={<strong>{money(r.total)}</strong>} />
                <div style={{ fontSize: "11px", color: "#777", paddingLeft: "4px" }}>
                  Valor: {money(r.valorDiaria)} · Bomba: {money(r.frete)}
                  {(r.viagens || []).length > 0 && ` · Viagens: ${r.viagens.length} (${money((r.viagens || []).reduce((s, v) => s + subtotalCarga(v) + (Number(v.valorBomba) || 0), 0))})`}
                </div>
              </div>
            ))}
            <ReportRow label="Subtotal Concreto" value={<strong>{money(totalEsc)}</strong>} />
          </div>
        )}

        {propostasPedido.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <strong style={{ fontSize: "13.5px" }}>Propostas ({propostasPedido.length})</strong>
            {propostasPedido.map((p) => (
              <ReportRow
                key={p.id}
                label={`${p.tipo} — ${new Date(p.criadaEm).toLocaleDateString("pt-BR")}`}
                value={money(p.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0))}
              />
            ))}
          </div>
        )}

        {contasPedido.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <strong style={{ fontSize: "13.5px" }}>Financeiro ({contasPedido.length})</strong>
            {contasPedido.map((c) => (
              <ReportRow key={c.id} label={`${c.tipo} — ${c.descricao || "-"} (${c.status})`} value={money(c.valor)} />
            ))}
          </div>
        )}

        {lancamentosEsc.length === 0 && propostasPedido.length === 0 && contasPedido.length === 0 && (
          <p style={{ fontSize: "13px", color: "#777" }}>Nenhum registro encontrado pra esse número de pedido.</p>
        )}

        <div style={{ borderTop: "2px solid #1a1a1a", marginTop: "18px", paddingTop: "12px", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "15px", fontWeight: 700 }}>Total geral: {money(totalGeral)}</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button
          variant="subtle"
          icon={MessageCircle}
          disabled={gerandoPdf}
          style={{ background: "#25D366", color: "#fff", borderColor: "#25D366", fontWeight: 700 }}
          onClick={enviar}
        >
          {gerandoPdf ? "Gerando PDF..." : "WhatsApp"}
        </Button>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      {aviso && <p style={{ fontSize: "12.5px", color: "var(--amber)", marginTop: "10px", textAlign: "right" }}>{aviso}</p>}
    </Modal>
  );
}

function ReportRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "13px" }}>
      <span style={{ color: "var(--text-faint)" }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: "right" }}>{value || "-"}</span>
    </div>
  );
}

function PedidoReport({ record, cliente, isPerfuratriz, isEscavadeira, onClose, onGerarProposta }) {
  const viagens = record.viagens || [];
  return (
    <Modal title={`Relatório do pedido nº ${record.pedido}`} onClose={onClose}>
      <div style={{ marginBottom: "6px" }}>
        <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "2px" }}>Cliente</div>
        <ReportRow label="Nome" value={cliente?.nome || record.cliente} />
        <ReportRow label="Telefone" value={cliente?.telefone} />
        <ReportRow label="Endereço" value={cliente?.endereco || record.endereco} />
      </div>
      <div style={{ marginTop: "14px" }}>
        <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "2px" }}>Serviço</div>
        <ReportRow label="Data" value={fmtDate(record.data)} />
        <ReportRow label="Concreto" value={record.equipamento} />
        <ReportRow label="Motorista" value={record.motorista || record.operador} />
        <ReportRow label="Placa caminhão" value={record.placa} />
        <ReportRow label="Vendedor" value={record.vendedor} />
        <ReportRow label="Status" value={record.status} />
      </div>
      {isEscavadeira && viagens.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "2px" }}>Cargas de entrega</div>
          {viagens.map((v, i) => (
            <ReportRow key={v.id} label={[`Carga ${i + 1}`, v.horario, v.placa].filter(Boolean).join(" · ")} value={money(subtotalCarga(v) + (Number(v.valorBomba) || 0))} />
          ))}
        </div>
      )}
      <div style={{ marginTop: "14px" }}>
        <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "2px" }}>Financeiro</div>
        <ReportRow label="Metro cúbico" value={record.qtdDias} />
        <ReportRow label="Valor" value={money(record.valorDiaria)} />
        <ReportRow label="Bomba" value={money(record.frete)} />
        <ReportRow label="Total" value={<span style={{ color: "var(--amber)" }}>{money(record.total)}</span>} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button icon={FileText} onClick={onGerarProposta}>Gerar proposta</Button>
      </div>
    </Modal>
  );
}

function ProducaoForm({ initial, equipamentos, isPerfuratriz, isEscavadeira, clienteByPedido, operadores, vendedores, motoristas, caminhoes, empresasRetirada, propostas, ticks, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const [abaAtiva, setAbaAtiva] = useState("lancamento");
  const [erroValidacao, setErroValidacao] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    salvarRascunho("producao", form);
  }, [form]);

  const matched = clienteByPedido.get(String(form.pedido).trim());
  const fallbackNome = !matched && form.cliente && form.cliente !== "-" ? form.cliente : null;
  const fallbackEndereco = !matched && form.endereco && form.endereco !== "-" ? form.endereco : null;
  // As cargas em si agora são editadas na Central de Balança — aqui só
  // usamos o que já existe pra calcular o total exibido corretamente.
  const viagens = form.viagens || [];
  const total = recalcularComCargas(form).total;
  const ehPago = form.status === "PAGO";
  // O bloco de pagamento aparece tanto pra status PAGO quanto EM ABERTO —
  // assim dá pra registrar um pagamento PARCIAL sem precisar marcar o
  // pedido como "pago" (o que seria enganoso enquanto falta receber parte).
  const mostraBlocoPagamento = form.status === "PAGO" || form.status === "EM ABERTO";
  // Se o campo "valor pago" ainda não foi digitado: quando o status é PAGO,
  // assume o total inteiro; quando é EM ABERTO, assume que nada foi pago
  // ainda (0), a não ser que a pessoa preencha um valor parcial.
  const valorPagoProducao = form.valorPago !== "" ? numeroSeguro(form.valorPago) : (ehPago ? total : 0);
  const restanteProducao = Math.max(0, total - valorPagoProducao);
  const pagamentoParcialProducao = mostraBlocoPagamento && restanteProducao > 0.005 && valorPagoProducao > 0.005;

  // O pedido usado pra buscar cargas só atualiza 300ms depois que a pessoa
  // parar de digitar — sem isso, com muitos ticks acumulados no sistema, a
  // busca refazia a cada letra digitada e podia travar o app no celular.
  const [pedidoParaBusca, setPedidoParaBusca] = useState(form.pedido);
  useEffect(() => {
    const timer = setTimeout(() => setPedidoParaBusca(form.pedido), 300);
    return () => clearTimeout(timer);
  }, [form.pedido]);

  const propostaDoPedido = (propostas || []).find((p) => String(p.pedido).trim() === String(form.pedido).trim());
  const totalProposta = propostaDoPedido ? propostaDoPedido.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0) : 0;

  // Antes, "puxar da proposta" jogava os itens dentro de "viagens" — que é
  // EXATAMENTE a mesma lista das cargas da Central de Balança. Isso criava
  // cargas falsas lá (sem volume/placa/motorista de verdade), inflava o
  // total a cada clique repetido (somava de novo por cima) e desalinhava
  // Financeiro e Fechamento. Agora não mexe mais em "viagens": só preenche
  // o valor por m³ e a quantidade do lançamento com o total da proposta —
  // e sempre SUBSTITUI (nunca soma), então clicar de novo não duplica nada.
  const puxarDaProposta = () => {
    if (!propostaDoPedido) return;
    setForm({ ...form, qtdDias: "1", valorDiaria: String(totalProposta.toFixed(2)) });
  };
  const jaPuxouDaProposta = propostaDoPedido && form.qtdDias === "1" && Number(form.valorDiaria) === Number(totalProposta.toFixed(2)) && totalProposta > 0;
  const limparValoresPuxados = () => setForm({ ...form, qtdDias: "", valorDiaria: "" });

  return (
    <>
    <Modal title={initial.equipamento ? "Editar lançamento" : "Novo lançamento"} onClose={() => { limparRascunho("producao"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ehPago && !form.formaPagamento.trim()) {
            setErroValidacao("Pra marcar como PAGO, é obrigatório preencher a forma de pagamento (PIX, boleto, dinheiro, etc).");
            return;
          }
          if (pagamentoParcialProducao && !form.dataProximoPagamento) {
            setErroValidacao("Como o pagamento foi parcial, preencha a data prevista pro próximo pagamento do restante.");
            return;
          }
          setErroValidacao("");
          limparRascunho("producao");
          // "Equipamento" (usado nos relatórios) vira a combinação de FCK +
          // Brita; "Operador" vira o motorista — assim os relatórios que já
          // existem continuam funcionando sem precisar mudar em outro lugar.
          const equipamentoMontado = [form.fck, form.brita, form.slump ? `SLUMP ${form.slump}` : ""].filter(Boolean).join(" - ");
          const dadosFinais = {
            ...form,
            equipamento: equipamentoMontado || form.equipamento,
            operador: form.motorista || form.operador,
          };
          // Se "valor pago" ficou em branco, salva com o total atual (pagamento
          // integral) — assim nunca grava vazio, mesmo sem o usuário mexer no campo.
          onSave(ehPago && form.valorPago === "" ? { ...dadosFinais, valorPago: total } : dadosFinais);
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Nº do pedido" required hint={matched || fallbackNome ? undefined : form.pedido ? "Nenhum cliente cadastrado com esse pedido" : undefined}>
            <Input value={form.pedido} onChange={set("pedido")} required />
          </Field>
          <Field label="Data">
            <Input type="date" value={form.data} onChange={set("data")} />
          </Field>
        </div>

        <div
          style={{
            background: "var(--bg-base)",
            border: "1px solid var(--border-soft)",
            borderRadius: "6px",
            padding: "10px 12px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", marginBottom: "4px", textTransform: "uppercase" }}>
            Cliente {matched ? "(automático)" : fallbackNome ? "(salvo neste pedido)" : ""}
          </div>
          {matched ? (
            <>
              <div style={{ fontWeight: 600 }}>{matched.nome}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>{enderecoCompleto(matched) || "Endereço não cadastrado"}</div>
              {matched.observacao && <div style={{ color: "var(--text-faint)", fontSize: "11.5px", marginTop: "2px" }}>Obs: {matched.observacao}</div>}
            </>
          ) : fallbackNome ? (
            <>
              <div style={{ fontWeight: 600 }}>{fallbackNome}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>{fallbackEndereco || "Endereço não cadastrado"}</div>
              <div style={{ color: "var(--text-faint)", fontSize: "11px", marginTop: "4px" }}>
                Este pedido não tem cadastro em Clientes — cadastre-o lá para manter os dados sempre atualizados.
              </div>
            </>
          ) : (
            <div style={{ color: "var(--text-faint)" }}>Digite um nº de pedido cadastrado em Clientes</div>
          )}
        </div>

        {propostaDoPedido && (
          <div
            style={{
              background: "var(--bg-panel-raised)",
              border: "1px solid var(--amber)",
              borderRadius: "6px",
              padding: "10px 12px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "12.5px" }}>
              <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--amber)", textTransform: "uppercase", marginBottom: "2px" }}>
                Proposta encontrada pra esse pedido
              </div>
              <div>{propostaDoPedido.itens.length} item(ns) · Total: <strong>{money(totalProposta)}</strong></div>
              {jaPuxouDaProposta && <div style={{ color: "var(--success)", fontSize: "11.5px", marginTop: "2px" }}>✓ Já puxado pra "Metro cúbico" / "Valor metro cúbico" abaixo</div>}
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {jaPuxouDaProposta && (
                <button type="button" onClick={limparValoresPuxados} className="tl-focus" style={{ background: "none", border: "none", color: "var(--danger)", fontSize: "12px", textDecoration: "underline", cursor: "pointer", padding: 0 }}>
                  Remover valores puxados
                </button>
              )}
              <Button type="button" size="sm" variant="subtle" icon={FileText} onClick={puxarDaProposta}>
                {jaPuxouDaProposta ? "Puxar de novo" : "Puxar itens e valores da proposta"}
              </Button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="FCK" hint="Ex: FCK 25, FCK 30">
            <Input value={form.fck} onChange={set("fck")} list="lista-fck" />
            <datalist id="lista-fck">
              <option value="FCK 15" />
              <option value="FCK 20" />
              <option value="FCK 25" />
              <option value="FCK 30" />
              <option value="FCK 35" />
              <option value="FCK 40" />
            </datalist>
          </Field>
          <Field label="Brita" hint="Ex: Brita 0, Brita 1">
            <Input value={form.brita} onChange={set("brita")} list="lista-brita" />
            <datalist id="lista-brita">
              <option value="Brita 0" />
              <option value="Brita 1" />
              <option value="Brita 2" />
            </datalist>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Slump" hint="Ex: 7+-1, 10+-2, 12+-2">
            <Input value={form.slump} onChange={set("slump")} />
          </Field>
          <Field label="Peça" hint="Ex: Laje, Piso, Base, Calçada, Sapata">
            <Input value={form.peca} onChange={set("peca")} list="lista-pecas" />
            <datalist id="lista-pecas">
              <option value="Laje" />
              <option value="Piso" />
              <option value="Base" />
              <option value="Calçada" />
              <option value="Sapata" />
              <option value="Viga" />
              <option value="Pilar" />
              <option value="Contrapiso" />
              <option value="Rampa" />
              <option value="Pavimentação" />
            </datalist>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Horário" hint="Hora prevista de carregamento">
            <Input type="time" value={form.horario} onChange={set("horario")} />
          </Field>
          <Field label="Pedido do cliente" hint="Nº de pedido/nota do lado do cliente, se houver">
            <Input value={form.pedidoCliente} onChange={set("pedidoCliente")} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              {Object.keys(STATUS_STYLES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>

        {mostraBlocoPagamento && (
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px" }}>
            <Field label={ehPago ? "Forma de pagamento *" : "Forma de pagamento"} hint={ehPago ? "Obrigatório quando o status é PAGO" : "Preenche se já recebeu algum valor adiantado"}>
              <Input value={form.formaPagamento} onChange={set("formaPagamento")} placeholder="Ex: PIX, boleto, dinheiro" required={ehPago} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Valor pago (R$)" hint={ehPago ? "Deixa em branco se pagou o total inteiro" : "Deixa em branco se ainda não recebeu nada"}>
                <Input type="number" min="0" step="0.01" value={form.valorPago} onChange={set("valorPago")} placeholder={ehPago ? money(total) : "0,00"} />
              </Field>
              <Field label="Falta pagar (calculado sozinho)">
                <div style={{ padding: "9px 12px", background: "var(--bg-panel-raised)", borderRadius: "6px", fontSize: "14px", fontWeight: 700, color: restanteProducao > 0.005 ? "var(--danger)" : "var(--success)" }} className="tl-mono">
                  {money(restanteProducao)}
                </div>
              </Field>
            </div>
            {pagamentoParcialProducao && (
              <Field label="Data prevista pro próximo pagamento *" hint="Obrigatório porque ficou faltando pagar uma parte">
                <Input type="date" value={form.dataProximoPagamento} onChange={set("dataProximoPagamento")} required />
              </Field>
            )}
          </div>
        )}

        {erroValidacao && (
          <div style={{ background: "#3A1E1E", border: "1px solid #5a3030", color: "#D6706F", borderRadius: "6px", padding: "10px 12px", fontSize: "12.5px", marginBottom: "14px" }}>
            {erroValidacao}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
          <Field label="Metro cúbico">
            <Input type="number" min="0" step="0.1" value={form.qtdDias} onChange={set("qtdDias")} />
          </Field>
          <Field label="Valor metro cúbico (R$)">
            <Input type="number" min="0" step="0.01" value={form.valorDiaria} onChange={set("valorDiaria")} />
          </Field>
          <Field label="Bomba (R$)">
            <Input type="number" min="0" step="0.01" value={form.frete} onChange={set("frete")} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Vendedor">
            <Input value={form.vendedor} onChange={set("vendedor")} list="lista-vendedores" />
            <datalist id="lista-vendedores">
              {porNome(vendedores).map((v) => <option key={v.id} value={v.nome} />)}
            </datalist>
          </Field>
        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-panel-raised)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "10px 14px",
            marginBottom: "18px",
          }}
        >
          <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total do pedido</span>
          <span className="tl-display" style={{ fontSize: "22px", fontWeight: 700, color: "var(--amber)" }}>{money(total)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("producao"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar lançamento</Button>
        </div>
      </form>
    </Modal>
    </>
  );
}

// Ordem de serviço de UMA carga específica — pronta pra imprimir. Os dados
// continuam salvos dentro do lançamento de Produção (pedido original); isso
// só formata essa carga sozinha pra impressão, sem duplicar nada.
// Célula da tabela "estilo canhoto" (bordas finas, rótulo pequeno em cima,
// valor embaixo) — usada em vários pontos da Ordem de Serviço pra imitar o
// layout de nota fiscal que a empresa já usa em papel.
function CelulaOS({ label, value, flex, borderRight = true }) {
  return (
    <div style={{ flex: flex || 1, padding: "5px 8px", borderRight: borderRight ? "1px solid #999" : "none", minWidth: 0 }}>
      <div style={{ fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.3px", color: "#666", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "11.5px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || "\u00A0"}</div>
    </div>
  );
}

function OrdemServicoCargaModal({ carga, indice, form, cliente, onClose }) {
  const nomeEmpresa = PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa";
  const anoPedido = (form.data || "").slice(0, 4) || new Date().getFullYear();
  const protocolo = `${form.pedido || "0"}${String(indice + 1).padStart(2, "0")}`;
  const razaoSocial = cliente?.empresa || cliente?.nome || form.cliente || "-";
  const cnpjCpf = cliente?.cpf || "-";
  const descricaoConcreto = [form.fck, form.brita, form.slump ? `SLUMP ${form.slump}` : ""].filter(Boolean).join(" - ") || "-";
  const valorBomba = numeroSeguro(carga.valorBomba);
  const totalCarga = subtotalCarga(carga) + valorBomba;

  return (
    <Modal title={`Ordem de Serviço — Carga ${indice + 1}`} onClose={onClose} wide>
      <div style={{ marginBottom: "16px" }}>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      <div className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", padding: "18px", fontFamily: "Inter, sans-serif", fontSize: "12px", border: "1px solid #999" }}>
        {/* Cabeçalho: logo/empresa à esquerda, data/horário/protocolo à direita */}
        <div style={{ display: "flex", borderBottom: "2px solid #1a1a1a", paddingBottom: "10px", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", objectFit: "contain", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: "15px", lineHeight: 1.15 }}>{nomeEmpresa}</div>
              {PREFS_ATUAL_REF?.enderecoEmpresa && <div style={{ fontSize: "9.5px", color: "#555" }}>{PREFS_ATUAL_REF.enderecoEmpresa}</div>}
              {PREFS_ATUAL_REF?.cnpjEmpresa && <div style={{ fontSize: "9.5px", color: "#555" }}>CNPJ: {PREFS_ATUAL_REF.cnpjEmpresa}</div>}
            </div>
          </div>
          <div style={{ display: "flex", border: "1px solid #1a1a1a" }}>
            <div style={{ padding: "5px 12px", borderRight: "1px solid #1a1a1a", textAlign: "center" }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "#666" }}>DATA DE ENTREGA</div>
              <div style={{ fontSize: "13px", fontWeight: 800 }}>{fmtDate(form.data) || "-"}</div>
            </div>
            <div style={{ padding: "5px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "#666" }}>HORÁRIO</div>
              <div style={{ fontSize: "13px", fontWeight: 800 }}>{carga.horario || "-"}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "10.5px", fontWeight: 700, marginBottom: "10px" }}>PROTOCOLO {protocolo}</div>

        {/* Destinatário */}
        <div style={{ fontSize: "9px", fontWeight: 700, color: "#666", marginBottom: "2px" }}>DESTINATÁRIO</div>
        <div style={{ border: "1px solid #999", marginBottom: "10px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #999" }}>
            <CelulaOS label="Razão Social" value={razaoSocial} flex={2.2} />
            <CelulaOS label="CNPJ / CPF" value={cnpjCpf} flex={1.3} />
            <CelulaOS label="Data da Emissão" value={fmtDate(form.data)} flex={1} borderRight={false} />
          </div>
          <div style={{ display: "flex", borderBottom: "1px solid #999" }}>
            <CelulaOS label="Endereço" value={cliente ? enderecoCompleto(cliente) : form.endereco || "-"} flex={2.2} />
            <CelulaOS label="Bairro / Distrito" value={cliente?.bairro} flex={1} />
            <CelulaOS label="CEP" value={cliente?.cep} flex={0.8} />
            <CelulaOS label="Data Entrada/Saída" value={fmtDate(form.data)} flex={1} borderRight={false} />
          </div>
          <div style={{ display: "flex" }}>
            <CelulaOS label="Município" value={cliente?.municipio} flex={1.4} />
            <CelulaOS label="Fone / Fax" value={cliente?.telefone} flex={1} />
            <CelulaOS label="UF" value={cliente?.uf} flex={0.5} />
            <CelulaOS label="Inscrição Estadual" value={cliente?.inscricaoEstadual} flex={1} />
            <CelulaOS label="Hora Entr/Saída" value={carga.horario} flex={1} borderRight={false} />
          </div>
        </div>

        {/* Dados do produto */}
        <div style={{ fontSize: "9px", fontWeight: 700, color: "#666", marginBottom: "2px" }}>DADOS DO PRODUTO</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "11.5px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #999", padding: "5px 8px", fontSize: "9px", textAlign: "left", background: "#f2f2f2" }}>VOLUME m³</th>
              <th style={{ border: "1px solid #999", padding: "5px 8px", fontSize: "9px", textAlign: "left", background: "#f2f2f2" }}>DESCRIÇÃO</th>
              <th style={{ border: "1px solid #999", padding: "5px 8px", fontSize: "9px", textAlign: "right", background: "#f2f2f2" }}>VAL. UNIT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #999", padding: "6px 8px", fontWeight: 700 }}>{carga.volume || "-"}</td>
              <td style={{ border: "1px solid #999", padding: "6px 8px", fontWeight: 700 }}>{descricaoConcreto}{form.peca ? ` — Peça: ${form.peca}` : ""}</td>
              <td style={{ border: "1px solid #999", padding: "6px 8px", fontWeight: 700, textAlign: "right" }}>{carga.valor ? money(carga.valor) : "-"}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ border: "1px solid #999", padding: "6px 8px", textAlign: "right" }}>
                {valorBomba > 0 && (
                  <div style={{ fontSize: "11px" }}>Taxa bomba{carga.numeroBomba ? ` Nº ${carga.numeroBomba}` : ""}: <strong>{money(valorBomba)}</strong></div>
                )}
                <div style={{ fontSize: "13px", fontWeight: 800, marginTop: valorBomba > 0 ? "3px" : 0 }}>Total: {money(totalCarga)}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Observações + informativo preventivo */}
        <div style={{ fontSize: "9px", fontWeight: 700, color: "#666", marginBottom: "2px" }}>OBSERVAÇÕES</div>
        <div style={{ border: "1px solid #999", padding: "10px", fontSize: "10.5px", lineHeight: 1.6, marginBottom: "10px" }}>
          <div style={{ marginBottom: "8px" }}>
            <strong>PED {form.pedido || "-"}/{String(anoPedido).slice(-2)}</strong>
            {form.vendedor ? `  VENDEDOR: ${form.vendedor}` : ""}
            {`  CONTRATANTE: ${razaoSocial}`}
            {cnpjCpf !== "-" ? ` - CNPJ/CPF: ${cnpjCpf}` : ""}
            {` - ENDEREÇO: ${cliente ? enderecoCompleto(cliente) : form.endereco || "-"}`}
            {carga.motorista ? ` - MOTORISTA: ${carga.motorista}` : ""}
            {carga.lacre ? ` - LACRE: ${carga.lacre}` : ""}
            {carga.placa ? ` - PLACA: ${carga.placa}` : ""}
            {valorBomba > 0 ? ` - BOMBA${carga.numeroBomba ? ` Nº ${carga.numeroBomba}` : ""}` : ""}
          </div>
          <div style={{ fontWeight: 700, marginBottom: "4px" }}>INFORMATIVO PREVENTIVO AO CLIENTE</div>
          <ol style={{ margin: 0, paddingLeft: "16px" }}>
            <li>Molhar bem a laje antes da concretagem;</li>
            <li>Conferir a nota fiscal e o lacre do caminhão;</li>
            <li>Verificar o escoramento na laje com apoios de 1 em 1 metro de distância, sob risco de abaulamento e queda;</li>
            <li>Não alterar a quantidade de água na mistura do concreto, aguardando no mínimo 35 minutos para molhar a laje, após concretagem, sob riscos de fissuras;</li>
            <li>Molhar a laje por 7 dias e cobrir com lona plástica, mantendo-a sempre umedecida, sob riscos de fissuras;</li>
            <li>Em caso de contratação de bomba para escoamento do concreto, providenciar um saco de cimento para nata lubrificadora;</li>
            <li>Em hipótese alguma deve permanecer sob a laje pessoas ou coisas, sendo de total e irrestrita responsabilidade do cliente eventuais danos que ocorrem com aqueles;</li>
            <li>A responsabilidade da {nomeEmpresa} se limita a obedecer as especificações técnicas do concreto fornecidas pelo cliente, contendo a dosagem, consistência e resistência;</li>
            <li>Concreto não é impermeável, assim não há garantia contra vazamentos posteriores à sua secagem;</li>
            <li>A {nomeEmpresa} só se responsabiliza pela entrega correta do produto adquirido, mas não pela medição da quantidade necessária deste, pois o volume pode sofrer variações conforme o terreno, superfícies e montagem das ferragens da obra. Desta forma, se o volume de concreto se mostrar insuficiente, caberá ao comprador a quitação da diferença à maior do concreto consumido;</li>
            <li>É de responsabilidade do cliente a montagem da laje com materiais apropriados e determinados pelo projeto estrutural, bem como a instalação correta das escoras, devidamente apoiadas em solo firme, tudo em condições técnicas hábeis para suportar o peso do concreto, da laje e dos profissionais que farão a concretagem.</li>
          </ol>
          <p style={{ marginTop: "8px", marginBottom: 0 }}>O cliente, que abaixo assina, se declara ciente dos termos acima descritos, bem como ser sua a responsabilidade pelo descumprimento de qualquer uma das regras expostas.</p>
        </div>

        <div style={{ display: "flex", gap: "24px", marginTop: "26px", marginBottom: "18px" }}>
          <div style={{ flex: 1, borderTop: "1px solid #1a1a1a", paddingTop: "4px", textAlign: "center", fontSize: "10px", color: "#555" }}>Assinatura</div>
          <div style={{ flex: 1, borderTop: "1px solid #1a1a1a", paddingTop: "4px", textAlign: "center", fontSize: "10px", color: "#555" }}>RG</div>
        </div>

        <div style={{ borderTop: "1px dashed #999", paddingTop: "10px", fontSize: "10.5px", lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, marginBottom: "4px" }}>ADIÇÃO DE ÁGUA</div>
          <p style={{ margin: 0 }}>
            Determinei a adição de ______ litros de água no volume de ______ m³ de concreto, elevado o abatimento máximo para ______ cm.
            Tenho ciência que esta adição de água acarretará alterações nas características do concreto, diminuindo a resistência do concreto.
          </p>
          <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
            <div style={{ flex: 1, borderTop: "1px solid #1a1a1a", paddingTop: "4px", textAlign: "center", fontSize: "10px", color: "#555" }}>Nome completo / RG</div>
            <div style={{ flex: 1, borderTop: "1px solid #1a1a1a", paddingTop: "4px", textAlign: "center", fontSize: "10px", color: "#555" }}>Assinatura / Data</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Tela dedicada da balança — digita o pedido, o sistema puxa cliente,
// endereço e a especificação do concreto sozinho, e o operador só lança
// cada carga que sai (horário, placa, motorista, volume, valor, lacre,
// bomba). As cargas ficam salvas dentro do mesmo lançamento de Produção.
// Box de fechamento do pedido — se ainda tem saldo em aberto, oferece um
// link pronto de cobrança pelo WhatsApp; sempre oferece dar baixa (marca o
// lançamento como CONCLUÍDO em Produção-Concreto).
function FinalizarPedidoBox({ lancamento, cliente, producaoEsc, onChangeProducaoEsc }) {
  const total = numeroSeguro(lancamento.total);
  const valorPago = lancamento.valorPago !== "" && lancamento.valorPago !== undefined ? numeroSeguro(lancamento.valorPago) : (lancamento.status === "PAGO" ? total : 0);
  const saldoAberto = Math.max(0, total - valorPago);
  const jaFinalizado = lancamento.status === "CONCLUÍDO";

  const finalizar = () => {
    onChangeProducaoEsc(producaoEsc.map((r) => (r.id === lancamento.id ? { ...r, status: "CONCLUÍDO" } : r)));
  };

  const linkCobranca = () => {
    const telefone = (cliente?.telefone || "").replace(/\D/g, "");
    const msg = `Olá! Sobre o pedido nº ${lancamento.pedido}, ainda está em aberto o valor de ${money(saldoAberto)}. Pode nos ajudar com a regularização? Qualquer dúvida, estamos à disposição!`;
    const url = telefone ? `https://wa.me/55${telefone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (jaFinalizado) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "12px 16px", marginBottom: "18px", fontSize: "12.5px", color: "var(--success)" }}>
        <CheckCircle2 size={16} /> Esse pedido já está marcado como concluído.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "12px 16px", marginBottom: "18px" }}>
      <div style={{ fontSize: "12.5px" }}>
        {saldoAberto > 0.005 ? (
          <span>Saldo em aberto: <strong style={{ color: "var(--danger)" }}>{money(saldoAberto)}</strong></span>
        ) : (
          <span style={{ color: "var(--success)" }}>Sem saldo em aberto — pode dar baixa.</span>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {saldoAberto > 0.005 && (
          <Button type="button" size="sm" variant="subtle" icon={MessageCircle} onClick={linkCobranca}>Enviar cobrança</Button>
        )}
        <Button type="button" size="sm" icon={CheckCircle2} onClick={finalizar}>Finalizar pedido</Button>
      </div>
    </div>
  );
}

function CentralBalancaModule({ producaoEsc, clienteByPedido, onChangeProducaoEsc, cartaTraco, movimentosEstoque, onChangeMovimentosEstoque, financeiro, onChangeFinanceiro }) {
  const [pedidoBusca, setPedidoBusca] = useState("");
  const [cargaAberta, setCargaAberta] = useState(null);
  const [imprimindoCarga, setImprimindoCarga] = useState(null);

  const hoje = new Date().toISOString().slice(0, 10);
  const producaoDoDia = useMemo(() => {
    return producaoEsc
      .filter((r) => r.data === hoje)
      .sort((a, b) => (a.horario || "").localeCompare(b.horario || ""));
  }, [producaoEsc, hoje]);

  const pedido = pedidoBusca.trim();
  const lancamento = pedido ? producaoEsc.find((r) => String(r.pedido).trim() === pedido) : null;
  const cliente = pedido ? clienteByPedido.get(pedido) : null;
  const viagens = lancamento?.viagens || [];
  const temTraco = lancamento ? cartaTraco.some((t) => (t.fck || "").trim().toLowerCase() === (lancamento.fck || "").trim().toLowerCase()) : false;

  // Recalcula os movimentos de estoque de TODAS as cargas desse lançamento
  // — sempre remove os antigos (pelo id da carga que os gerou) e recria do
  // zero com os valores atuais, pra nunca duplicar ao editar uma carga.
  const recalcularEstoqueDasCargas = (novasViagens) => {
    if (!lancamento) return movimentosEstoque;
    const idsDasCargas = new Set(novasViagens.map((v) => v.id));
    const semAntigos = movimentosEstoque.filter((m) => !(m.origemCargaId && idsDasCargas.has(m.origemCargaId)));
    const novosMovimentos = [];
    novasViagens.forEach((v) => {
      const volumeBruto = Number(v.volume) || 0;
      const sobra = Number(v.sobra) || 0;
      const volumeEfetivo = Math.max(0, volumeBruto - sobra);
      if (volumeEfetivo <= 0) return;
      const consumo = calcularConsumoMateriais(cartaTraco, lancamento.fck, volumeEfetivo);
      if (!consumo) return;
      Object.entries(consumo).forEach(([material, quantidade]) => {
        if (quantidade <= 0) return;
        novosMovimentos.push({
          id: uid(),
          origemCargaId: v.id,
          data: lancamento.data || hoje,
          material,
          tipo: "Saída",
          quantidade: Number(quantidade.toFixed(3)),
          motivo: `Consumo automático — Pedido ${lancamento.pedido}, carta traço ${lancamento.fck}`,
        });
      });
    });
    return [...semAntigos, ...novosMovimentos];
  };

  const atualizarViagens = (novasViagens) => {
    if (!lancamento) return;
    const atualizado = recalcularComCargas({ ...lancamento, viagens: novasViagens });
    onChangeProducaoEsc(producaoEsc.map((r) => (r.id === lancamento.id ? atualizado : r)));
    onChangeMovimentosEstoque(recalcularEstoqueDasCargas(novasViagens));
  };

  const setViagem = (id, k, v) => atualizarViagens(viagens.map((it) => (it.id === id ? { ...it, [k]: v } : it)));
  const addViagem = () => {
    atualizarViagens([...viagens, emptyViagem()]);
    setCargaAberta(viagens.length);
  };
  const duplicarUltimaCarga = () => {
    const base = viagens[viagens.length - 1];
    const nova = { ...emptyViagem(), placa: base?.placa || "", motorista: base?.motorista || "", volume: base?.volume || "", valor: base?.valor || "" };
    atualizarViagens([...viagens, nova]);
    setCargaAberta(viagens.length);
  };
  const removeViagem = (id) => {
    atualizarViagens(viagens.filter((it) => it.id !== id));
    setCargaAberta(null);
  };
  const resumoCarga = (v) => {
    const subtotal = subtotalCarga(v);
    const partes = [v.horario, v.placa, v.volume ? `${v.volume} m³` : "", subtotal > 0 ? money(subtotal) : ""].filter(Boolean);
    return partes.length > 0 ? partes.join(" · ") : "Toca pra preencher";
  };

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Operação" title="Central de Balança" />

      <div style={{ marginBottom: "22px" }}>
        <h4 className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Produção de hoje</h4>
        {producaoDoDia.length === 0 ? (
          <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nenhum pedido lançado ainda pra hoje.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "720px" }}>
            {producaoDoDia.map((r) => {
              const cli = clienteByPedido.get(String(r.pedido).trim());
              const selecionado = pedido === String(r.pedido).trim();
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setPedidoBusca(String(r.pedido).trim())}
                  className="tl-focus"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: selecionado ? "1px solid var(--accent)" : "1px solid var(--border-soft)",
                    background: selecionado ? "var(--bg-panel-raised)" : "var(--bg-panel)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <PedidoStub n={r.pedido} />
                    <span style={{ fontWeight: 600, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cli ? cli.nome : r.cliente || "-"}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-faint)" }}>{[r.fck, r.brita].filter(Boolean).join(" · ")}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{(r.viagens || []).length} carga(s)</span>
                    <StatusBadge status={r.status} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ maxWidth: "640px" }}>
        <Field label="Nº do pedido" hint="Digita o pedido, ou clica em um da lista acima">
          <Input value={pedidoBusca} onChange={(e) => setPedidoBusca(e.target.value)} placeholder="Ex: 620" style={{ fontSize: "16px" }} />
        </Field>

        {pedido && !lancamento && (
          <EmptyState icon={Truck} title="Nenhum lançamento encontrado com esse pedido" hint="Cadastra o lançamento em Produção-Concreto primeiro (FCK, brita, slump, valor) — depois volta aqui pra lançar as cargas." />
        )}

        {lancamento && (
          <>
            <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "14px 16px", marginBottom: "18px" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{cliente ? cliente.nome : lancamento.cliente || "-"}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "8px" }}>{cliente ? enderecoCompleto(cliente) : lancamento.endereco || "-"}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                {[lancamento.fck, lancamento.brita, lancamento.slump ? `SLUMP ${lancamento.slump}` : ""].filter(Boolean).join(" · ") || "Sem especificação de concreto lançada"}
                {lancamento.peca ? `  ·  Peça: ${lancamento.peca}` : ""}
              </div>
            </div>

            <FinalizarPedidoBox lancamento={lancamento} cliente={cliente} producaoEsc={producaoEsc} onChangeProducaoEsc={onChangeProducaoEsc} />

            <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Cargas de entrega (Ordens de Serviço)</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {viagens.length > 0 && (
                  <Button type="button" size="sm" variant="ghost" icon={Copy} onClick={duplicarUltimaCarga}>Repetir última</Button>
                )}
                <Button type="button" size="sm" variant="subtle" icon={Plus} onClick={addViagem}>Carga</Button>
              </div>
            </div>

            {viagens.length === 0 ? (
              <EmptyState icon={Truck} title="Nenhuma carga lançada ainda pra esse pedido" hint='Clica em "Carga" pra registrar a primeira viagem de caminhão.' />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
                {viagens.map((v, i) => {
                  const aberta = cargaAberta === i;
                  return (
                    <div key={v.id} style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "8px", overflow: "hidden" }}>
                      <div
                        onClick={() => setCargaAberta(aberta ? null : i)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", cursor: "pointer" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                          <ChevronRight size={14} style={{ color: "var(--text-faint)", flexShrink: 0, transform: aberta ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", flexShrink: 0 }}>Carga {i + 1}</span>
                          <span style={{ fontSize: "12px", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resumoCarga(v)}</span>
                        </div>
                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                          <button type="button" onClick={() => setImprimindoCarga(i)} className="tl-focus" style={iconBtnStyle} title="Imprimir ordem de serviço dessa carga">
                            <Printer size={13} />
                          </button>
                          <button type="button" onClick={() => removeViagem(v.id)} className="tl-focus" style={{ ...iconBtnStyle, color: "var(--danger)" }}>
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                      {aberta && (
                        <div style={{ padding: "0 10px 12px 10px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: "0 8px" }}>
                            <Field label="Horário">
                              <Input type="time" value={v.horario} onChange={(e) => setViagem(v.id, "horario", e.target.value)} />
                            </Field>
                            <Field label="Placa">
                              <Input value={v.placa} onChange={(e) => setViagem(v.id, "placa", e.target.value)} />
                            </Field>
                            <Field label="Motorista">
                              <Input value={v.motorista} onChange={(e) => setViagem(v.id, "motorista", e.target.value)} />
                            </Field>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                            <Field label="Volume (m³)">
                              <Input type="number" min="0" step="0.1" value={v.volume} onChange={(e) => setViagem(v.id, "volume", e.target.value)} />
                            </Field>
                            <Field label="Valor por m³ (R$)">
                              <Input type="number" min="0" step="0.01" value={v.valor} onChange={(e) => setViagem(v.id, "valor", e.target.value)} />
                            </Field>
                          </div>
                          {(numeroSeguro(v.volume) > 0 && numeroSeguro(v.valor) > 0) && (
                            <div style={{ fontSize: "11px", color: "var(--text-faint)", textAlign: "right", marginBottom: "8px" }}>
                              {v.volume} m³ × {money(v.valor)} = <strong style={{ color: "var(--text-muted)" }}>{money(subtotalCarga(v))}</strong>
                            </div>
                          )}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                            <Field label="Lacre" hint="Número do lacre dessa carga">
                              <Input value={v.lacre} onChange={(e) => setViagem(v.id, "lacre", e.target.value)} />
                            </Field>
                            <Field label="Bomba nessa carga (R$)" hint="Deixa em branco se não teve">
                              <Input type="number" min="0" step="0.01" value={v.valorBomba} onChange={(e) => setViagem(v.id, "valorBomba", e.target.value)} />
                            </Field>
                          </div>
                          {numeroSeguro(v.valorBomba) > 0 && (
                            <Field label="Nº da bomba" hint="Aparece na Ordem de Serviço, ex: Bomba Nº 69">
                              <Input value={v.numeroBomba} onChange={(e) => setViagem(v.id, "numeroBomba", e.target.value)} />
                            </Field>
                          )}
                          <Field label="Sobra que voltou (m³)" hint="Se o caminhão voltou com sobra reaproveitável, desconta daqui do consumo de estoque">
                            <Input type="number" min="0" step="0.1" value={v.sobra} onChange={(e) => setViagem(v.id, "sobra", e.target.value)} />
                          </Field>
                          {numeroSeguro(v.sobra) > 0 && (
                            <Field label="Sobra usada em qual obra? (nº do pedido)" hint="Deixa em branco se ainda não foi usada em outra obra — aparece no relatório de Sobras">
                              <Input value={v.sobraDestinoPedido} onChange={(e) => setViagem(v.id, "sobraDestinoPedido", e.target.value)} placeholder="Ex: 624" />
                            </Field>
                          )}
                          {temTraco ? (
                            numeroSeguro(v.volume) > 0 && (
                              <p style={{ fontSize: "10.5px", color: "var(--text-faint)" }}>
                                Consumo de estoque calculado sozinho pela carta traço, sobre {Math.max(0, numeroSeguro(v.volume) - numeroSeguro(v.sobra)).toFixed(1)} m³ efetivos.
                              </p>
                            )
                          ) : (
                            <p style={{ fontSize: "10.5px", color: "var(--amber)" }}>
                              Sem carta traço cadastrada pro FCK "{lancamento.fck || "-"}" — o estoque não vai ser abatido sozinho pra essa carga.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", padding: "6px 2px", color: "var(--text-muted)" }}>
                  <span>{viagens.length} carga(s) — {viagens.reduce((s, v) => s + (Number(v.volume) || 0), 0).toFixed(1)} m³ entregues</span>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {money(viagens.reduce((s, v) => s + subtotalCarga(v) + (Number(v.valorBomba) || 0), 0))}
                    {viagens.some((v) => numeroSeguro(v.valorBomba) > 0) && (
                      <span style={{ fontWeight: 400, fontSize: "11px", color: "var(--text-faint)" }}> (inclui bomba)</span>
                    )}
                  </strong>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {imprimindoCarga !== null && viagens[imprimindoCarga] && (
        <OrdemServicoCargaModal
          carga={viagens[imprimindoCarga]}
          indice={imprimindoCarga}
          form={lancamento}
          cliente={cliente}
          onClose={() => setImprimindoCarga(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Propostas module                                                    */
/* ------------------------------------------------------------------ */
const emptyItem = () => ({ id: uid(), descricao: "", qtd: 1, valorUnit: "" });
// Observações padrão pra propostas (editável em código)
const DESCRITIVO_ESCAVADEIRA = `Orçamento válido pelo prazo de 15 dias.
Se precisar de nota fiscal, acrescentar 18% ao valor total.`;


const emptyProposta = () => ({
  id: uid(),
  clienteId: "",
  obraTexto: "",
  tipo: "Bombeamento de concreto",
  itens: [emptyItem()],
  observacao: "",
  enderecoEntrega: "", // local da obra — pode ser diferente do endereço de cobrança do cliente
  descritivo: DESCRITIVO_ESCAVADEIRA, // editável — cada proposta pode ter o texto ajustado
  formaPagamento: "",
  prazoPagamento: "",
  validade: "",
  vendedorId: "",
  criadaEm: new Date().toISOString(),
  status: "Aberta", // Aberta | Fechada | Perdida
  dataBaixa: "",
  motivoPerda: "",
});

function PropostasModule({ propostas, clientes, vendedores, onChange, draft, onDraftHandled }) {
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [baixando, setBaixando] = useState(null); // { proposta, tipo: "Fechada" | "Perdida" }
  const [filtroStatus, setFiltroStatus] = useState("todas"); // todas | Aberta | Fechada | Perdida

  useEffect(() => {
    if (draft) {
      setEditing({ ...emptyProposta(), clienteId: draft.clienteId || "", obraTexto: draft.obraTexto || "" });
      onDraftHandled();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const save = (proposta) => {
    const exists = propostas.some((p) => p.id === proposta.id);
    onChange(exists ? propostas.map((p) => (p.id === proposta.id ? proposta : p)) : [...propostas, proposta]);
    setEditing(null);
  };

  const remove = (id) => {
    onChange(propostas.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const confirmarBaixa = (status, motivoPerda) => {
    const atualizada = { ...baixando.proposta, status, dataBaixa: new Date().toISOString().slice(0, 10), motivoPerda: motivoPerda || "" };
    onChange(propostas.map((p) => (p.id === atualizada.id ? atualizada : p)));
    setBaixando(null);
  };

  // Manda a proposta pro WhatsApp do cliente já formatada — sem precisar
  // digitar nada na mão, sem precisar exportar PDF antes.
  const enviarPropostaWhatsApp = (proposta, cliente) => {
    const total = proposta.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0);
    const linhasItens = proposta.itens
      .filter((it) => it.descricao)
      .map((it) => `• ${it.descricao} — ${it.qtd} ${it.unidade || ""} × ${money(it.valorUnit)}`)
      .join("\n");
    const texto = [
      `Olá, ${cliente.nome}! Segue a proposta:`,
      "",
      linhasItens,
      "",
      `Total: ${money(total)}`,
      proposta.formaPagamento ? `Forma de pagamento: ${proposta.formaPagamento}` : "",
      proposta.validade ? `Válida até: ${fmtDate(proposta.validade)}` : "",
      "",
      "Qualquer dúvida, é só chamar!",
    ].filter(Boolean).join("\n");
    const numeroFinal = (cliente.telefone || "").replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroFinal}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const propostasFiltradas = filtroStatus === "todas" ? propostas : propostas.filter((p) => (p.status || "Aberta") === filtroStatus);

  const STATUS_PROPOSTA_COR = {
    Aberta: { bg: "#52431D", fg: "#F0B958" },
    Fechada: { bg: "#2B4F3A", fg: "#7BC492" },
    Perdida: { bg: "#532B2B", fg: "#E88886" },
  };

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Comercial"
        title="Propostas"
        action={<Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("proposta", emptyProposta))}>Nova proposta</Button>}
      />

      <div style={{ display: "flex", gap: "4px", marginBottom: "18px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "4px", width: "fit-content", flexWrap: "wrap" }}>
        {[
          { id: "todas", label: "Todas" },
          { id: "Aberta", label: "Abertas" },
          { id: "Fechada", label: "Fechadas" },
          { id: "Perdida", label: "Perdidas" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFiltroStatus(t.id)}
            className="tl-focus"
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background: filtroStatus === t.id ? "var(--accent)" : "transparent",
              color: filtroStatus === t.id ? "var(--accent-text)" : "var(--text-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {propostasFiltradas.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhuma proposta encontrada" hint="Cria uma proposta nova, ou ajusta o filtro acima." />
      ) : (
        <Table
          columns={["Cliente", "Obra", "Tipo", "Total", "Status", ""]}
          rows={[...propostasFiltradas].sort((a, b) => (b.criadaEm || "").localeCompare(a.criadaEm || "")).map((p) => {
            const cliente = clientes.find((c) => c.id === p.clienteId);
            const total = p.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0);
            const status = p.status || "Aberta";
            const cor = STATUS_PROPOSTA_COR[status];
            return (
              <tr key={p.id} style={rowStyle}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{cliente ? cliente.nome : "-"}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{p.obraTexto || "-"}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{p.tipo}</td>
                <td style={tdStyle} className="tl-mono">{money(total)}</td>
                <td style={tdStyle}>
                  <span style={{ background: cor.bg, color: cor.fg, padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
                    {status.toUpperCase()}
                  </span>
                  {status === "Perdida" && p.motivoPerda && (
                    <div style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "3px" }}>{p.motivoPerda}</div>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "4px" }}>
                    {status === "Aberta" && (
                      <>
                        <button onClick={() => setBaixando({ proposta: p, tipo: "Fechada" })} className="tl-focus" style={iconBtnStyle} title="Marcar como Fechada (ganhou)">
                          <Check size={14} style={{ color: "var(--success)" }} />
                        </button>
                        <button onClick={() => setBaixando({ proposta: p, tipo: "Perdida" })} className="tl-focus" style={iconBtnStyle} title="Marcar como Perdida">
                          <X size={14} style={{ color: "var(--danger)" }} />
                        </button>
                      </>
                    )}
                    {cliente?.telefone && (
                      <button onClick={() => enviarPropostaWhatsApp(p, cliente)} className="tl-focus" style={iconBtnStyle} title="Enviar por WhatsApp">
                        <MessageCircle size={14} style={{ color: "var(--success)" }} />
                      </button>
                    )}
                    <button onClick={() => setViewing(p)} className="tl-focus" style={iconBtnStyle} title="Visualizar / imprimir">
                      <Printer size={14} />
                    </button>
                    <RowActions onEdit={() => setEditing(p)} onDelete={() => setDeleting(p)} />
                  </div>
                </td>
              </tr>
            );
          })}
        />
      )}

      {editing && (
        <PropostaForm initial={editing} clientes={clientes} vendedores={vendedores} onSave={save} onClose={() => setEditing(null)} />
      )}
      {viewing && (
        <PropostaPreview proposta={viewing} cliente={clientes.find((c) => c.id === viewing.clienteId)} onClose={() => setViewing(null)} />
      )}
      {deleting && (
        <ConfirmDelete label={`a proposta de "${clientes.find((c) => c.id === deleting.clienteId)?.nome || "cliente"}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
      {baixando && (
        <BaixaPropostaModal baixando={baixando} onConfirm={confirmarBaixa} onCancel={() => setBaixando(null)} />
      )}
    </div>
  );
}

function BaixaPropostaModal({ baixando, onConfirm, onCancel }) {
  const [motivoPerda, setMotivoPerda] = useState("");
  const ganhou = baixando.tipo === "Fechada";

  return (
    <Modal title={ganhou ? "Marcar proposta como Fechada" : "Marcar proposta como Perdida"} onClose={onCancel}>
      <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
        {ganhou
          ? `Confirma que o cliente fechou o pedido nº ${baixando.proposta.pedido}?`
          : `Confirma que essa proposta do pedido nº ${baixando.proposta.pedido} não vai fechar?`}
      </p>
      {!ganhou && (
        <Field label="Motivo (opcional)" hint="Ajuda a entender por que não fechou">
          <Input value={motivoPerda} onChange={(e) => setMotivoPerda(e.target.value)} placeholder="Ex: preço, concorrência, desistiu da obra..." />
        </Field>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onConfirm(baixando.tipo, motivoPerda)} variant={ganhou ? "primary" : "danger"}>
          {ganhou ? "Confirmar fechamento" : "Confirmar perda"}
        </Button>
      </div>
    </Modal>
  );
}

function PropostaForm({ initial, clientes, vendedores, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const matched = clientes.find((c) => c.id === form.clienteId);

  useEffect(() => {
    salvarRascunho("proposta", form);
  }, [form]);

  const setItem = (id, k, v) =>
    setForm({ ...form, itens: form.itens.map((it) => (it.id === id ? { ...it, [k]: v } : it)) });
  const addItem = () => setForm({ ...form, itens: [...form.itens, emptyItem()] });
  const removeItem = (id) => setForm({ ...form, itens: form.itens.filter((it) => it.id !== id) });

  const total = form.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0);

  return (
    <Modal title={initial.clienteId ? "Editar proposta" : "Nova proposta"} onClose={() => { limparRascunho("proposta"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          limparRascunho("proposta");
          onSave(form);
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Cliente" required>
            <Select value={form.clienteId} onChange={set("clienteId")} required>
              <option value="">Selecione...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </Field>
          <Field label="Tipo de serviço">
            <Input value={form.tipo} onChange={set("tipo")} placeholder="Ex: Bombeamento de concreto" />
          </Field>
        </div>

        {matched && (
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", marginBottom: "14px", fontSize: "12.5px" }}>
            <span style={{ color: "var(--text-muted)" }}>Tel: {matched.telefone || "-"}</span>
            {matched.obras && matched.obras.length > 0 && (
              <div style={{ marginTop: "6px" }}>
                <Field label="Obra">
                  <Select value={form.obraTexto} onChange={(e) => setForm({ ...form, obraTexto: e.target.value, enderecoEntrega: matched.obras.find((o) => o.nome === e.target.value)?.endereco || form.enderecoEntrega })}>
                    <option value="">Selecione uma obra cadastrada (opcional)...</option>
                    {matched.obras.map((o) => <option key={o.id} value={o.nome}>{o.nome}</option>)}
                  </Select>
                </Field>
              </div>
            )}
          </div>
        )}

        <Field label="Endereço da obra" hint="Puxa sozinho se você escolher uma obra cadastrada acima, mas pode editar">
          <Input value={form.enderecoEntrega} onChange={set("enderecoEntrega")} placeholder="Ex: Rua da Obra, 123 - Bairro X" />
        </Field>

        <Field label="Vendedor">
          <Select value={form.vendedorId} onChange={set("vendedorId")}>
            <option value="">Sem vendedor definido</option>
            {(vendedores || []).map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
          </Select>
        </Field>

        <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Itens da proposta</span>
          <Button type="button" size="sm" variant="subtle" icon={Plus} onClick={addItem}>Item</Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
          {form.itens.map((it) => {
            const ehConcreto = /fck/i.test(it.descricao || "");
            return (
            <div key={it.id} style={{ display: "grid", gridTemplateColumns: "2fr 70px 110px 32px", gap: "8px", alignItems: "center" }}>
              <Input placeholder="Descrição do serviço" value={it.descricao} onChange={(e) => setItem(it.id, "descricao", e.target.value)} />
              <Input type="number" min="0" placeholder={ehConcreto ? "m³" : "Qtd"} value={it.qtd} onChange={(e) => setItem(it.id, "qtd", e.target.value)} />
              <Input type="number" min="0" step="0.01" placeholder="Valor unit." value={it.valorUnit} onChange={(e) => setItem(it.id, "valorUnit", e.target.value)} />
              <button type="button" onClick={() => removeItem(it.id)} className="tl-focus" style={{ ...iconBtnStyle, color: "var(--danger)" }}>
                <X size={13} />
              </button>
            </div>
            );
          })}
        </div>

        <Field label="Observação">
          <TextArea value={form.observacao} onChange={set("observacao")} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
          <Field label="Forma de pagamento">
            <Input value={form.formaPagamento} onChange={set("formaPagamento")} placeholder="Ex: PIX à vista" />
          </Field>
          <Field label="Prazo de pagamento">
            <Input value={form.prazoPagamento} onChange={set("prazoPagamento")} placeholder="Ex: 30 dias" />
          </Field>
          <Field label="Validade da proposta">
            <Input type="date" value={form.validade} onChange={set("validade")} />
          </Field>
        </div>

        <Field label="Descritivo (condições gerais)" hint="Aparece no rodapé do PDF — pode editar livremente pra essa proposta">
          <TextArea rows={5} value={form.descritivo !== undefined ? form.descritivo : DESCRITIVO_ESCAVADEIRA} onChange={set("descritivo")} />
        </Field>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-panel-raised)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "10px 14px",
            marginBottom: "18px",
          }}
        >
          <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total da proposta</span>
          <span className="tl-display" style={{ fontSize: "22px", fontWeight: 700, color: "var(--amber)" }}>{money(total)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("proposta"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar proposta</Button>
        </div>
      </form>
    </Modal>
  );
}

function PropostaPreview({ proposta, cliente, onClose }) {
  const total = proposta.itens.reduce((s, it) => s + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [avisoPdf, setAvisoPdf] = useState("");

  const enviarPdf = async () => {
    setGerandoPdf(true);
    setAvisoPdf("");
    const blob = await gerarPdfProposta(proposta, cliente, total);
    setGerandoPdf(false);

    if (!blob) {
      setAvisoPdf("Geração de PDF não disponível nesta pré-visualização. Use \"Imprimir\" e escolha \"Salvar como PDF\" — no site publicado esse botão gera o PDF direto.");
      return;
    }

    const fileName = `proposta-${(cliente?.nome || "cliente").replace(/\s+/g, "-").toLowerCase()}-${(proposta.criadaEm || "").slice(0, 10)}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (ehCelular && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Proposta — ${cliente?.nome || "Cliente"}`,
          text: `Proposta — ${cliente?.nome || "Cliente"} - ${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`,
        });
        return;
      } catch (e) {
        /* usuário cancelou ou não conseguiu compartilhar — segue para o download abaixo */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.alert(`PDF baixado como "${fileName}" (confira a pasta Downloads).\n\nO WhatsApp vai abrir agora só com o texto — anexe esse arquivo baixado na conversa antes de enviar.`);

    const linhas = proposta.itens
      .map((it) => `• ${it.descricao || "Item"} (x${it.qtd}): ${money((Number(it.qtd) || 0) * (Number(it.valorUnit) || 0))}`)
      .join("\n");
    const texto =
      `Olá${cliente ? `, ${cliente.nome}` : ""}! Segue a proposta:\n\n${linhas}\n\n` +
      `*Total: ${money(total)}*\n\n${proposta.observacao || ""}\n\n${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;
    const telefone = (cliente?.telefone || "").replace(/\D/g, "");
    const numeroFinal = telefone ? (telefone.startsWith("55") ? telefone : `55${telefone}`) : "";
    window.open(`https://wa.me/${numeroFinal}?text=${encodeURIComponent(texto)}`, "_blank");
    setAvisoPdf("PDF baixado e WhatsApp aberto com a mensagem pronta — é só anexar o arquivo baixado na conversa.");
  };

  return (
    <Modal title="Visualizar proposta" onClose={onClose} wide>
      <div id="proposta-print" className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", borderRadius: "6px", padding: "28px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #1a1a1a", paddingBottom: "14px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", borderRadius: "6px" }} />
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "20px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
              <div style={{ fontSize: "11.5px", color: "#555" }}>{[PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" — ")}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px", fontWeight: 700 }}>PROPOSTA — {cliente?.nome || "Cliente"}</div>
            <div style={{ fontSize: "11.5px", color: "#555" }}>{proposta.tipo} · {new Date(proposta.criadaEm).toLocaleDateString("pt-BR")}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: "12.5px", marginBottom: "20px" }}>
          <div><strong>Cliente:</strong> {cliente ? cliente.nome : "-"}</div>
          <div><strong>Contato:</strong> {cliente?.telefone || "-"}</div>
          <div><strong>CPF/CNPJ:</strong> {cliente?.cpf || "-"}</div>
          <div><strong>Endereço:</strong> {cliente?.endereco || "-"}</div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", marginBottom: "16px" }}>
          <thead>
            <tr style={{ background: "#f0efe9" }}>
              <th style={previewTh}>Descrição</th>
              <th style={{ ...previewTh, textAlign: "center" }}>Qtd</th>
              <th style={{ ...previewTh, textAlign: "right" }}>Valor unit.</th>
              <th style={{ ...previewTh, textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {proposta.itens.map((it) => (
              <tr key={it.id}>
                <td style={previewTd}>{it.descricao || "-"}</td>
                <td style={{ ...previewTd, textAlign: "center" }}>{it.qtd}</td>
                <td style={{ ...previewTd, textAlign: "right" }}>{money(it.valorUnit)}</td>
                <td style={{ ...previewTd, textAlign: "right" }}>{money((Number(it.qtd) || 0) * (Number(it.valorUnit) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>Total: {money(total)}</div>
        </div>

        {proposta.observacao && (
          <div style={{ fontSize: "12px", color: "#555", borderTop: "1px solid #ddd", paddingTop: "12px" }}>
            {proposta.observacao}
          </div>
        )}

        <div style={{ fontSize: "11px", color: "#444", borderTop: "1px solid #ddd", marginTop: "16px", paddingTop: "14px", whiteSpace: "pre-line", lineHeight: 1.6 }}>
          {proposta.descritivo !== undefined ? proposta.descritivo : DESCRITIVO_ESCAVADEIRA}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button
          variant="subtle"
          icon={Mail}
          onClick={() => {
            const subject = `Proposta — ${cliente?.nome || "Cliente"} - ${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;
            const linhas = proposta.itens
              .map((it) => `- ${it.descricao || "Item"} (x${it.qtd}): ${money((Number(it.qtd) || 0) * (Number(it.valorUnit) || 0))}`)
              .join("%0D%0A");
            const body =
              `Olá${cliente ? `, ${cliente.nome}` : ""}!%0D%0A%0D%0A` +
              `Segue a proposta:%0D%0A%0D%0A${linhas}%0D%0A%0D%0A` +
              `Total: ${money(total)}%0D%0A%0D%0A${proposta.observacao ? proposta.observacao + "%0D%0A%0D%0A" : ""}` +
              `Atenciosamente,%0D%0A${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;
            window.open(`mailto:${cliente?.email || ""}?subject=${encodeURIComponent(subject)}&body=${body}`, "_blank");
          }}
        >
          E-mail
        </Button>
        <Button
          variant="subtle"
          icon={MessageCircle}
          disabled={gerandoPdf}
          onClick={enviarPdf}
        >
          {gerandoPdf ? "Gerando PDF..." : "WhatsApp"}
        </Button>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      {avisoPdf && (
        <p style={{ fontSize: "12.5px", color: "var(--amber)", marginTop: "10px", textAlign: "right" }}>{avisoPdf}</p>
      )}
    </Modal>
  );
}
const previewTh = { textAlign: "left", padding: "7px 8px", borderBottom: "1px solid #ddd", fontWeight: 600 };
const previewTd = { padding: "7px 8px", borderBottom: "1px solid #eee" };

/* ------------------------------------------------------------------ */
/*  Manutenção módulo (máquinas + manutenção + abastecimento)          */
/* ------------------------------------------------------------------ */
const emptyMaquina = () => ({ id: uid(), nome: "", tipo: "Escavadeira" });
const emptyManutencao = () => ({
  id: uid(),
  maquinaId: "",
  tipo: "Manutenção",
  data: "",
  descricao: "",
  horimetro: "",
  litros: "",
  valor: "",
  observacao: "",
  fotos: [],
});

function ManutencaoModule({ maquinas, manutencoes, onChangeMaquinas, onChangeManutencoes }) {
  const [editingMaquina, setEditingMaquina] = useState(null);
  const [deletingMaquina, setDeletingMaquina] = useState(null);
  const [editingReg, setEditingReg] = useState(null);
  const [deletingReg, setDeletingReg] = useState(null);
  const [filtroMaquina, setFiltroMaquina] = useState("todas");
  const [aba, setAba] = useState("lista"); // lista | relatorio

  const maquinaById = useMemo(() => {
    const map = new Map();
    maquinas.forEach((m) => map.set(m.id, m));
    return map;
  }, [maquinas]);

  const saveMaquina = (m) => {
    const exists = maquinas.some((x) => x.id === m.id);
    onChangeMaquinas(exists ? maquinas.map((x) => (x.id === m.id ? m : x)) : [...maquinas, m]);
    setEditingMaquina(null);
  };
  const removeMaquina = (id) => {
    onChangeMaquinas(maquinas.filter((x) => x.id !== id));
    setDeletingMaquina(null);
  };

  const saveReg = (r) => {
    const exists = manutencoes.some((x) => x.id === r.id);
    onChangeManutencoes(exists ? manutencoes.map((x) => (x.id === r.id ? r : x)) : [...manutencoes, r]);
    setEditingReg(null);
  };
  const removeReg = (id) => {
    onChangeManutencoes(manutencoes.filter((x) => x.id !== id));
    setDeletingReg(null);
  };

  const registrosFiltrados =
    filtroMaquina === "todas" ? manutencoes : manutencoes.filter((r) => r.maquinaId === filtroMaquina);

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Frota" title="Manutenção & Abastecimento" />

      <div style={{ marginBottom: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h4 className="tl-mono" style={{ fontSize: "11.5px", letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Máquinas cadastradas
          </h4>
          <Button size="sm" variant="subtle" icon={Plus} onClick={() => setEditingMaquina(emptyMaquina())}>Máquina</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
          {porNome(maquinas).map((m) => (
            <div key={m.id} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Wrench size={14} style={{ color: "var(--amber)", marginTop: "2px" }} />
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => setEditingMaquina(m)} className="tl-focus" style={iconBtnStyle}><Pencil size={12} /></button>
                  <button onClick={() => setDeletingMaquina(m)} className="tl-focus" style={{ ...iconBtnStyle, color: "var(--danger)" }}><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="tl-display" style={{ fontSize: "17px", fontWeight: 700, marginTop: "8px" }}>{m.nome}</div>
              <div style={{ fontSize: "11.5px", color: "var(--text-faint)" }}>{m.tipo}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button size="sm" variant={aba === "lista" ? "primary" : "subtle"} onClick={() => setAba("lista")} type="button">Lista</Button>
          <Button size="sm" variant={aba === "relatorio" ? "primary" : "subtle"} onClick={() => setAba("relatorio")} type="button">Relatório</Button>
        </div>
        {aba === "lista" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <Select value={filtroMaquina} onChange={(e) => setFiltroMaquina(e.target.value)} style={{ width: "220px" }}>
              <option value="todas">Todas as máquinas</option>
              {porNome(maquinas).map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </Select>
            <Button icon={Plus} onClick={() => setEditingReg(abrirNovoRegistro("manutencao", emptyManutencao))}>Novo registro</Button>
          </div>
        )}
      </div>

      {aba === "relatorio" && (
        <RelatorioConsumoMaquinas manutencoes={manutencoes} maquinas={maquinas} maquinaById={maquinaById} />
      )}

      {aba === "lista" && (registrosFiltrados.length === 0 ? (
        <EmptyState icon={Wrench} title="Nenhum registro ainda" hint="Lance manutenções e abastecimentos por máquina." />
      ) : (
        <Table
          columns={["Máquina", "Tipo", "Data", "Descrição", "Valor", ""]}
          rows={[...registrosFiltrados].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data))).map((r) => (
            <tr key={r.id} style={rowStyle}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>
                {maquinaById.get(r.maquinaId)?.nome || (r.maquinaNome ? <span style={{ color: "var(--amber)" }} title="Nome vindo da planilha — ainda não vinculado a uma máquina cadastrada">{r.maquinaNome} ⚠️</span> : "-")}
              </td>
              <td style={tdStyle}>
                <span
                  className="tl-mono"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "3px",
                    background: r.tipo === "Abastecimento" ? "#2C3F55" : "#52431D",
                    color: r.tipo === "Abastecimento" ? "#8CBCE8" : "#F0B958",
                  }}
                >
                  {r.tipo === "Abastecimento" ? "ABASTECIMENTO" : "MANUTENÇÃO"}
                </span>
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.descricao || "-"}</td>
              <td style={tdStyle} className="tl-mono">{money(r.valor)}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <RowActions onEdit={() => setEditingReg(r)} onDelete={() => setDeletingReg(r)} />
              </td>
            </tr>
          ))}
        />
      ))}

      {editingMaquina && <MaquinaForm initial={editingMaquina} onSave={saveMaquina} onClose={() => setEditingMaquina(null)} />}
      {deletingMaquina && (
        <ConfirmDelete label={`a máquina "${deletingMaquina.nome}"`} dados={deletingMaquina} onConfirm={() => removeMaquina(deletingMaquina.id)} onCancel={() => setDeletingMaquina(null)} />
      )}
      {editingReg && (
        <ManutencaoForm initial={editingReg} maquinas={maquinas} onSave={saveReg} onClose={() => setEditingReg(null)} />
      )}
      {deletingReg && (
        <ConfirmDelete label="este registro" dados={deletingReg} onConfirm={() => removeReg(deletingReg.id)} onCancel={() => setDeletingReg(null)} />
      )}
    </div>
  );
}

function RelatorioConsumoMaquinas({ manutencoes, maquinas, maquinaById }) {
  const [periodo, setPeriodo] = useState("mensal"); // diario | semanal | mensal

  const abastecimentos = manutencoes.filter((r) => r.tipo === "Abastecimento");

  // Consumo total (litros e valor) por máquina — pro gráfico comparativo
  const porMaquina = useMemo(() => {
    const map = new Map();
    abastecimentos.forEach((r) => {
      const nome = maquinaById.get(r.maquinaId)?.nome || "Sem máquina";
      if (!map.has(nome)) map.set(nome, { litros: 0, valor: 0, manutencaoValor: 0 });
      map.get(nome).litros += Number(r.litros) || 0;
      map.get(nome).valor += Number(r.valor) || 0;
    });
    manutencoes
      .filter((r) => r.tipo !== "Abastecimento")
      .forEach((r) => {
        const nome = maquinaById.get(r.maquinaId)?.nome || "Sem máquina";
        if (!map.has(nome)) map.set(nome, { litros: 0, valor: 0, manutencaoValor: 0 });
        map.get(nome).manutencaoValor += Number(r.valor) || 0;
      });
    return [...map.entries()].sort((a, b) => b[1].litros - a[1].litros).slice(0, 10);
  }, [manutencoes, maquinaById]);

  // Consumo agrupado por período (diário/semanal/mensal), somando todas as máquinas
  const chaveDe = (dataStr) => {
    if (!dataStr) return null;
    if (periodo === "diario") return dataStr;
    if (periodo === "semanal") return isoWeekKey(dataStr);
    return dataStr.slice(0, 7);
  };

  const buckets = useMemo(() => {
    const map = new Map();
    abastecimentos.forEach((r) => {
      const chave = chaveDe(r.data);
      if (!chave) return;
      if (!map.has(chave)) map.set(chave, { litros: 0, valor: 0 });
      map.get(chave).litros += Number(r.litros) || 0;
      map.get(chave).valor += Number(r.valor) || 0;
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 20);
  }, [abastecimentos, periodo]);

  const totalLitros = abastecimentos.reduce((s, r) => s + (Number(r.litros) || 0), 0);
  const totalAbastecimento = abastecimentos.reduce((s, r) => s + (Number(r.valor) || 0), 0);
  const totalManutencao = manutencoes.filter((r) => r.tipo !== "Abastecimento").reduce((s, r) => s + (Number(r.valor) || 0), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "22px" }}>
        <MiniStat label="Total abastecido" valor={`${totalLitros.toFixed(0)} L`} cor="var(--amber)" />
        <MiniStat label="Gasto com abastecimento" valor={money(totalAbastecimento)} cor="var(--danger)" />
        <MiniStat label="Gasto com manutenção" valor={money(totalManutencao)} cor="var(--text-primary)" />
      </div>

      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "18px", marginBottom: "22px" }}>
        <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "14px" }}>
          Consumo de combustível por máquina (litros)
        </h4>
        <GraficoBarras
          series={[{ nome: "Litros", cor: "var(--amber)", dados: porMaquina.map(([nome, d]) => ({ label: nome, valor: d.litros })) }]}
          formatarValor={(v) => `${v.toFixed(0)} L`}
        />
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { id: "diario", label: "Diário" },
          { id: "semanal", label: "Semanal" },
          { id: "mensal", label: "Mensal" },
        ].map((p) => (
          <Button key={p.id} size="sm" variant={periodo === p.id ? "primary" : "subtle"} onClick={() => setPeriodo(p.id)} type="button">
            {p.label}
          </Button>
        ))}
      </div>

      {buckets.length === 0 ? (
        <EmptyState icon={BarChart2} title="Sem abastecimentos registrados ainda" hint="O relatório aparece assim que houver registros de abastecimento com data e litros." />
      ) : (
        <>
          <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "18px", marginBottom: "20px" }}>
            <GraficoBarras
              series={[{ nome: "Litros", cor: "var(--amber)", dados: [...buckets].reverse().map(([chave, d]) => ({ label: chave, valor: d.litros })) }]}
              formatarValor={(v) => `${v.toFixed(0)} L`}
            />
          </div>
          <Table
            columns={["Período", "Litros abastecidos", "Gasto"]}
            rows={buckets.map(([chave, d]) => (
              <tr key={chave} style={rowStyle}>
                <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{chave}</td>
                <td style={tdStyle} className="tl-mono">{d.litros.toFixed(0)} L</td>
                <td style={tdStyle} className="tl-mono">{money(d.valor)}</td>
              </tr>
            ))}
          />
        </>
      )}

      <div style={{ marginTop: "26px" }}>
        <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
          Desempenho por máquina
        </h4>
        {porMaquina.length === 0 ? (
          <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Sem dados ainda.</p>
        ) : (
          <Table
            columns={["Máquina", "Litros abastecidos", "Gasto abastecimento", "Gasto manutenção", "Gasto total"]}
            rows={porMaquina.map(([nome, d]) => (
              <tr key={nome} style={rowStyle}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{nome}</td>
                <td style={tdStyle} className="tl-mono">{d.litros.toFixed(0)} L</td>
                <td style={tdStyle} className="tl-mono">{money(d.valor)}</td>
                <td style={tdStyle} className="tl-mono">{money(d.manutencaoValor)}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(d.valor + d.manutencaoValor)}</td>
              </tr>
            ))}
          />
        )}
      </div>
    </div>
  );
}

function MaquinaForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <Modal title={initial.nome ? "Editar máquina" : "Nova máquina"} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <Field label="Nome / identificação" required>
          <Input value={form.nome} onChange={set("nome")} required />
        </Field>
        <Field label="Tipo">
          <Select value={form.tipo} onChange={set("tipo")}>
            <option>Escavadeira</option>
            <option>Outro</option>
          </Select>
        </Field>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}

function ManutencaoForm({ initial, maquinas, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isAbastecimento = form.tipo === "Abastecimento";

  useEffect(() => {
    salvarRascunho("manutencao", form);
  }, [form]);

  return (
    <Modal title={initial.descricao ? "Editar registro" : "Novo registro"} onClose={() => { limparRascunho("manutencao"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form onSubmit={(e) => { e.preventDefault(); limparRascunho("manutencao"); onSave(form); }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Máquina" required>
            <Select value={form.maquinaId} onChange={set("maquinaId")} required>
              <option value="">Selecionar</option>
              {porNome(maquinas).map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo de registro">
            <Select value={form.tipo} onChange={set("tipo")}>
              <option>Manutenção</option>
              <option>Abastecimento</option>
            </Select>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Data">
            <Input type="date" value={form.data} onChange={set("data")} />
          </Field>
          <Field label="Horímetro / KM">
            <Input value={form.horimetro} onChange={set("horimetro")} />
          </Field>
        </div>

        <Field label={isAbastecimento ? "O que foi feito" : "Descrição do serviço"}>
          <Input
            placeholder={isAbastecimento ? "Ex: Abastecimento diesel" : "Ex: Troca de óleo e filtros"}
            value={form.descricao}
            onChange={set("descricao")}
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: isAbastecimento ? "1fr 1fr" : "1fr", gap: "0 16px" }}>
          {isAbastecimento && (
            <Field label="Litros">
              <Input type="number" min="0" step="0.1" value={form.litros} onChange={set("litros")} />
            </Field>
          )}
          <Field label="Valor (R$)">
            <Input type="number" min="0" step="0.01" value={form.valor} onChange={set("valor")} />
          </Field>
        </div>

        <Field label="Observação">
          <TextArea value={form.observacao} onChange={set("observacao")} />
        </Field>

        <FotosUpload fotos={form.fotos || []} onChange={(fotos) => setForm({ ...form, fotos })} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("manutencao"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar registro</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Fotos de obra módulo                                                */
/* ------------------------------------------------------------------ */
function PhotoThumb({ id, onClick }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadPhotoBlob(id).then((v) => {
      if (!active) return;
      if (v) setSrc(v);
      else setFailed(true);
    });
    return () => { active = false; };
  }, [id]);

  return (
    <button
      onClick={onClick}
      className="tl-focus"
      style={{
        aspectRatio: "1",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid var(--border-soft)",
        background: "var(--bg-panel-raised)",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {failed ? (
        <ImageOff size={18} style={{ color: "var(--text-faint)" }} />
      ) : src ? (
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Loader2 size={16} style={{ color: "var(--text-faint)" }} />
      )}
    </button>
  );
}


/* ------------------------------------------------------------------ */
/*  Agenda módulo                                                       */
/* ------------------------------------------------------------------ */
const emptyCompromisso = () => ({
  id: uid(),
  titulo: "",
  tipo: "Compromisso",
  data: new Date().toISOString().slice(0, 10),
  hora: "",
  maquinaId: "",
  pedido: "",
  observacao: "",
  status: "Pendente",
});

function AgendaModule({ agenda, maquinas, clienteByPedido, producaoEsc, producaoPerf, onChange }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [visao, setVisao] = useState("calendario"); // calendario | lista

  const maquinaById = useMemo(() => {
    const map = new Map();
    maquinas.forEach((m) => map.set(m.id, m));
    return map;
  }, [maquinas]);

  const hojeISO = new Date().toISOString().slice(0, 10);

  const save = (c) => {
    const exists = agenda.some((x) => x.id === c.id);
    onChange(exists ? agenda.map((x) => (x.id === c.id ? c : x)) : [...agenda, c]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(agenda.filter((x) => x.id !== id));
    setDeleting(null);
  };
  const toggleConcluido = (c) => {
    onChange(agenda.map((x) => (x.id === c.id ? { ...x, status: x.status === "Concluído" ? "Pendente" : "Concluído" } : x)));
  };

  const ordenada = [...agenda].sort((a, b) => dataOrdenavel(a.data || "9999").localeCompare(dataOrdenavel(b.data || "9999")));
  const atrasados = ordenada.filter((c) => dataOrdenavel(c.data) < hojeISO && c.status !== "Concluído");
  const hoje = ordenada.filter((c) => dataOrdenavel(c.data) === hojeISO && c.status !== "Concluído");
  const futuros = ordenada.filter((c) => dataOrdenavel(c.data) > hojeISO && c.status !== "Concluído");
  const concluidos = ordenada.filter((c) => c.status === "Concluído");

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Planejamento"
        title="Agenda"
        action={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button size="sm" variant={visao === "calendario" ? "primary" : "subtle"} onClick={() => setVisao("calendario")} type="button">Calendário</Button>
            <Button size="sm" variant={visao === "lista" ? "primary" : "subtle"} onClick={() => setVisao("lista")} type="button">Lista</Button>
            <Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("agenda", emptyCompromisso))}>Novo compromisso</Button>
          </div>
        }
      />

      {visao === "calendario" && (
        <div style={{ marginBottom: "26px" }}>
          <CalendarioMensal agenda={agenda} producaoEsc={producaoEsc} producaoPerf={producaoPerf} clienteByPedido={clienteByPedido} />
        </div>
      )}

      {visao === "lista" && (agenda.length === 0 ? (
        <EmptyState icon={Calendar} title="Nenhum compromisso ainda" hint="Cadastre agendamentos de máquinas e compromissos gerais." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <AgendaGroup titulo="Atrasados" cor="var(--danger)" itens={atrasados} maquinaById={maquinaById} clienteByPedido={clienteByPedido} onEdit={setEditing} onDelete={setDeleting} onToggle={toggleConcluido} />
          <AgendaGroup titulo="Hoje" cor="var(--amber)" itens={hoje} maquinaById={maquinaById} clienteByPedido={clienteByPedido} onEdit={setEditing} onDelete={setDeleting} onToggle={toggleConcluido} />
          <AgendaGroup titulo="Próximos" cor="var(--text-muted)" itens={futuros} maquinaById={maquinaById} clienteByPedido={clienteByPedido} onEdit={setEditing} onDelete={setDeleting} onToggle={toggleConcluido} />
          {concluidos.length > 0 && (
            <AgendaGroup titulo="Concluídos" cor="var(--success)" itens={concluidos} maquinaById={maquinaById} clienteByPedido={clienteByPedido} onEdit={setEditing} onDelete={setDeleting} onToggle={toggleConcluido} muted />
          )}
        </div>
      ))}

      {editing && <AgendaForm initial={editing} maquinas={maquinas} onSave={save} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDelete label={`o compromisso "${deleting.titulo}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

// Lista os equipamentos que estiveram em obra num dia (AAAA-MM-DD),
// juntando os lançamentos de Produção.
function maquinasNoDia(dataISO, producaoEsc, producaoPerf) {
  const doDia = [];
  (producaoEsc || []).forEach((r) => {
    if (r.data === dataISO) doDia.push({ equipamento: r.equipamento || "-", cliente: r.cliente || "-", tipo: "Escavadeira", pedido: r.pedido });
  });
  (producaoPerf || []).forEach((r) => {
    if (r.data === dataISO) doDia.push({ equipamento: r.equipamento || "-", cliente: r.cliente || "-", tipo: "Perfuratriz", pedido: r.pedido });
  });
  return doDia;
}

function CalendarioMensal({ agenda, producaoEsc, producaoPerf, clienteByPedido, compacto }) {
  const hoje = new Date();
  const [mesRef, setMesRef] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const hojeISO = hoje.toISOString().slice(0, 10);

  const ano = mesRef.getFullYear();
  const mes = mesRef.getMonth();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0=dom
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null);
  for (let d = 1; d <= totalDias; d++) celulas.push(d);

  const isoDoDia = (d) => `${ano}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const nomesMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const diaInfo = diaSelecionado
    ? {
        iso: diaSelecionado,
        compromissos: (agenda || []).filter((a) => a.data === diaSelecionado),
        maquinas: maquinasNoDia(diaSelecionado, producaoEsc, producaoPerf),
      }
    : null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" className="tl-focus" onClick={() => setMesRef(new Date(ano, mes - 1, 1))} style={{ ...iconBtnStyle, cursor: "pointer" }}>‹</button>
          <span className="tl-display" style={{ fontSize: "17px", fontWeight: 700 }}>{nomesMes[mes]} {ano}</span>
          <button type="button" className="tl-focus" onClick={() => setMesRef(new Date(ano, mes + 1, 1))} style={{ ...iconBtnStyle, cursor: "pointer" }}>›</button>
        </div>
        <Button size="sm" variant="subtle" type="button" onClick={() => setMesRef(new Date(hoje.getFullYear(), hoje.getMonth(), 1))}>Hoje</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="tl-mono" style={{ textAlign: "center", fontSize: "10.5px", color: "var(--text-faint)", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {celulas.map((d, i) => {
          if (d === null) return <div key={`vazio-${i}`} />;
          const iso = isoDoDia(d);
          const maqs = maquinasNoDia(iso, producaoEsc, producaoPerf);
          const compCount = (agenda || []).filter((a) => a.data === iso && a.status !== "Concluído").length;
          const ehHoje = iso === hojeISO;
          const selecionado = iso === diaSelecionado;
          return (
            <button
              type="button"
              key={iso}
              onClick={() => setDiaSelecionado(selecionado ? null : iso)}
              className="tl-focus"
              style={{
                minHeight: compacto ? "44px" : "64px",
                borderRadius: "6px",
                border: ehHoje ? "1px solid var(--amber)" : "1px solid var(--border-soft)",
                background: selecionado ? "var(--bg-panel-raised)" : "var(--bg-panel)",
                cursor: "pointer",
                padding: "4px 5px",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span className="tl-mono" style={{ fontSize: "11px", fontWeight: ehHoje ? 700 : 500, color: ehHoje ? "var(--amber)" : "var(--text-muted)" }}>{d}</span>
              {maqs.length > 0 && (
                <span style={{ fontSize: "9.5px", color: "var(--text-primary)", background: "var(--bg-panel-raised)", borderRadius: "3px", padding: "1px 4px", alignSelf: "flex-start" }}>
                  {maqs.length} máq.
                </span>
              )}
              {compCount > 0 && (
                <span style={{ fontSize: "9.5px", color: "var(--amber)" }}>● {compCount} evento{compCount > 1 ? "s" : ""}</span>
              )}
            </button>
          );
        })}
      </div>

      {diaInfo && (
        <div style={{ marginTop: "14px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px" }}>
          <div className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
            {fmtDate(diaInfo.iso)}
          </div>

          {diaInfo.maquinas.length === 0 && diaInfo.compromissos.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--text-faint)" }}>Nada registrado nesse dia.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {diaInfo.maquinas.length > 0 && (
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Máquinas em obra</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {diaInfo.maquinas.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span><strong>{m.equipamento}</strong> · {m.tipo}</span>
                        <span style={{ color: "var(--text-muted)" }}>{m.cliente} (#{m.pedido})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {diaInfo.compromissos.length > 0 && (
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Compromissos</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {diaInfo.compromissos.map((c) => (
                      <div key={c.id} style={{ fontSize: "13px" }}>
                        {c.hora && <span className="tl-mono" style={{ color: "var(--text-faint)" }}>{c.hora} · </span>}
                        {c.titulo} <span style={{ color: "var(--text-muted)" }}>({c.status})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgendaGroup({ titulo, cor, itens, maquinaById, clienteByPedido, onEdit, onDelete, onToggle, muted }) {
  if (itens.length === 0) return null;
  return (
    <div>
      <h4 className="tl-mono" style={{ fontSize: "11.5px", letterSpacing: "0.05em", color: cor, marginBottom: "10px", textTransform: "uppercase" }}>
        {titulo} · {itens.length}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {itens.map((c) => {
          const maquina = maquinaById.get(c.maquinaId);
          const cliente = c.pedido ? clienteByPedido.get(String(c.pedido).trim()) : null;
          return (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "var(--bg-panel)",
                border: "1px solid var(--border-soft)",
                borderRadius: "8px",
                padding: "12px 14px",
                opacity: muted ? 0.6 : 1,
              }}
            >
              <button
                onClick={() => onToggle(c)}
                className="tl-focus"
                title="Marcar como concluído"
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "5px",
                  border: `2px solid ${c.status === "Concluído" ? "var(--success)" : "var(--text-faint)"}`,
                  background: c.status === "Concluído" ? "var(--success)" : "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: "62px", fontSize: "12px" }} className="tl-mono">
                <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{fmtDate(c.data)}</div>
                {c.hora && <div style={{ color: "var(--text-faint)" }}>{c.hora}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "13.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.titulo || "Sem título"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {c.tipo}
                  {maquina && ` · ${maquina.nome}`}
                  {c.pedido && ` · Pedido #${c.pedido}`}
                  {cliente && ` (${cliente.nome})`}
                </div>
              </div>
              <RowActions onEdit={() => onEdit(c)} onDelete={() => onDelete(c)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaForm({ initial, maquinas, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    salvarRascunho("agenda", form);
  }, [form]);

  return (
    <Modal title={initial.titulo ? "Editar compromisso" : "Novo compromisso"} onClose={() => { limparRascunho("agenda"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form onSubmit={(e) => { e.preventDefault(); limparRascunho("agenda"); onSave(form); }}>
        <Field label="Título" required>
          <Input value={form.titulo} onChange={set("titulo")} required placeholder="Ex: Manutenção preventiva ESC30" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
          <Field label="Data" required>
            <Input type="date" value={form.data} onChange={set("data")} required />
          </Field>
          <Field label="Hora">
            <Input type="time" value={form.hora} onChange={set("hora")} />
          </Field>
          <Field label="Tipo">
            <Select value={form.tipo} onChange={set("tipo")}>
              <option>Compromisso</option>
              <option>Manutenção de máquina</option>
              <option>Entrega</option>
              <option>Retirada</option>
              <option>Reunião</option>
            </Select>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Máquina vinculada" hint="Opcional">
            <Select value={form.maquinaId} onChange={set("maquinaId")}>
              <option value="">Nenhuma</option>
              {porNome(maquinas).map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </Select>
          </Field>
          <Field label="Pedido vinculado" hint="Opcional — puxa o cliente automaticamente">
            <Input value={form.pedido} onChange={set("pedido")} />
          </Field>
        </div>

        <Field label="Observação">
          <TextArea value={form.observacao} onChange={set("observacao")} />
        </Field>

        <Field label="Status">
          <Select value={form.status} onChange={set("status")}>
            <option>Pendente</option>
            <option>Concluído</option>
          </Select>
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("agenda"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar compromisso</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Tick de Carregamento módulo                                         */
/* ------------------------------------------------------------------ */
const emptyTick = () => ({
  id: uid(),
  placa: "",
  tipoResiduo: "",
  pedido: "",
  nomeContrato: "",
  maquinaId: "",
  operador: "",
  data: new Date().toISOString().slice(0, 10),
  horario: new Date().toTimeString().slice(0, 5),
  cliente: "",
  endereco: "",
  telefoneCliente: "",
  fotos: [],
  assinatura: "",
});

function AssinaturaPad({ valor, onChange }) {
  const canvasRef = React.useRef(null);
  const desenhandoRef = React.useRef(false);
  const [temTraço, setTemTraço] = useState(!!valor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1a1a1a";
    if (valor) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = valor;
    }
  }, []);

  const posicao = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: ((cx - rect.left) / rect.width) * canvas.width, y: ((cy - rect.top) / rect.height) * canvas.height };
  };

  const iniciar = (e) => {
    e.preventDefault();
    desenhandoRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const p = posicao(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const mover = (e) => {
    if (!desenhandoRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const p = posicao(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const parar = () => {
    if (!desenhandoRef.current) return;
    desenhandoRef.current = false;
    setTemTraço(true);
    onChange(canvasRef.current.toDataURL("image/png"));
  };
  const limpar = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setTemTraço(false);
    onChange("");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={160}
        style={{ width: "100%", height: "150px", background: "#fff", borderRadius: "6px", border: "1px solid var(--border)", touchAction: "none", cursor: "crosshair" }}
        onMouseDown={iniciar}
        onMouseMove={mover}
        onMouseUp={parar}
        onMouseLeave={parar}
        onTouchStart={iniciar}
        onTouchMove={mover}
        onTouchEnd={parar}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
        <span style={{ fontSize: "11px", color: "var(--text-faint)" }}>Cliente assina com o dedo ou o mouse aqui em cima</span>
        <Button type="button" size="sm" variant="ghost" icon={Trash2} onClick={limpar}>Limpar assinatura</Button>
      </div>
    </div>
  );
}



// Sistema genérico de rascunho — qualquer formulário do sistema pode usar
// essas 3 funções pra nunca perder o que a pessoa digitou, mesmo trocando
// de aba ou fechando o app sem salvar. Cada tipo de formulário usa sua
// própria chave (ex: "cliente", "producao-esc", "proposta"...).
const salvarRascunho = (chave, form) => {
  try {
    localStorage.setItem(`tl-rascunho:${chave}`, JSON.stringify(form));
  } catch (e) {}
};
const lerRascunho = (chave) => {
  try {
    const s = localStorage.getItem(`tl-rascunho:${chave}`);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
};
const limparRascunho = (chave) => {
  try {
    localStorage.removeItem(`tl-rascunho:${chave}`);
  } catch (e) {}
};

function RascunhoBanner() {
  return (
    <div style={{ background: "var(--bg-base)", border: "1px solid var(--amber)", borderRadius: "6px", padding: "8px 12px", marginBottom: "14px", fontSize: "12.5px", color: "var(--amber)" }}>
      ↻ Rascunho recuperado — o que você tinha digitado antes de sair não foi perdido.
    </div>
  );
}

// Abre um formulário novo checando primeiro se tem rascunho salvo daquele
// tipo — se tiver qualquer campo preenchido, usa ele; senão usa o registro
// vazio de sempre. `extras` deixa sobrescrever campos (ex: próximo pedido).
const abrirNovoRegistro = (chave, criarVazio, extras = {}) => {
  const rascunho = lerRascunho(chave);
  // Proteção contra rascunho corrompido ou gigante demais (ex: uma lista
  // de viagens que cresceu descontroladamente numa sessão antiga) — se
  // parecer estranho, descarta e começa do zero, sem travar a tela.
  const rascunhoParaceRazoavel = (r) => {
    if (!r || typeof r !== "object") return false;
    try {
      const tamanho = JSON.stringify(r).length;
      if (tamanho > 50000) return false; // rascunho normal tem poucos KB
    } catch (e) {
      return false;
    }
    return true;
  };
  const temConteudo =
    rascunho &&
    rascunhoParaceRazoavel(rascunho) &&
    Object.keys(rascunho).some((k) => k !== "id" && k !== "__rascunho" && rascunho[k] !== "" && rascunho[k] !== null && (!Array.isArray(rascunho[k]) || rascunho[k].length > 0));
  if (temConteudo) return { ...rascunho, __rascunho: true };
  if (rascunho && !rascunhoParaceRazoavel(rascunho)) limparRascunho(chave);
  return { ...criarVazio(), ...extras };
};







/* ------------------------------------------------------------------ */
/*  Controle Diário módulo                                              */
/* ------------------------------------------------------------------ */
const emptyControleDiario = () => ({
  id: uid(),
  maquinaId: "",
  operador: "",
  data: new Date().toISOString().slice(0, 10),
  horimetroInicio: "",
  horimetroFim: "",
  abastecida: false,
  litros: "",
  observacao: "",
  fotos: [],
});

function ControleDiarioModule({ registros, maquinas, onChange, isAdmin, requireAdmin }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);
  const [filtroMaquina, setFiltroMaquina] = useState("todas");

  const maquinaById = useMemo(() => {
    const map = new Map();
    maquinas.forEach((m) => map.set(m.id, m));
    return map;
  }, [maquinas]);

  const horasDe = (r) => {
    const ini = Number(r.horimetroInicio);
    const fim = Number(r.horimetroFim);
    if (isNaN(ini) || isNaN(fim) || fim < ini) return 0;
    return fim - ini;
  };

  const save = (r) => {
    const exists = registros.some((x) => x.id === r.id);
    onChange(exists ? registros.map((x) => (x.id === r.id ? r : x)) : [...registros, r]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(registros.filter((x) => x.id !== id));
    setDeleting(null);
  };

  const registrosFiltrados = filtroMaquina === "todas" ? registros : registros.filter((r) => r.maquinaId === filtroMaquina);

  const relatorio = useMemo(() => {
    const porMaquina = new Map();
    registrosFiltrados.forEach((r) => {
      const key = r.maquinaId || "sem-maquina";
      if (!porMaquina.has(key)) porMaquina.set(key, { horas: 0, litros: 0, dias: 0 });
      const acc = porMaquina.get(key);
      acc.horas += horasDe(r);
      acc.litros += r.abastecida ? Number(r.litros) || 0 : 0;
      acc.dias += 1;
    });
    return porMaquina;
  }, [registrosFiltrados]);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Apontamento diário"
        title="Controle Diário"
        action={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="subtle" icon={Gauge} onClick={() => setMostrarRelatorio(true)}>Relatório</Button>
            <Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("controle-diario", emptyControleDiario))}>Novo apontamento</Button>
          </div>
        }
      />

      <p style={{ fontSize: "12px", color: "var(--text-faint)", marginBottom: "16px" }}>
        Qualquer pessoa pode registrar o apontamento do dia. Editar ou excluir um registro já salvo pede a senha de administrador.
      </p>

      <div style={{ marginBottom: "16px", maxWidth: "240px" }}>
        <Select value={filtroMaquina} onChange={(e) => setFiltroMaquina(e.target.value)}>
          <option value="todas">Todas as máquinas</option>
          {porNome(maquinas).map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </Select>
      </div>

      {registrosFiltrados.length === 0 ? (
        <EmptyState icon={Gauge} title="Nenhum apontamento ainda" hint="Registre o horímetro de início e fim do dia de cada máquina." />
      ) : (
        <Table
          columns={["Máquina", "Operador", "Data", "Horímetro", "Horas", "Abastecida", ""]}
          rows={[...registrosFiltrados].sort((a, b) => (b.data || "").localeCompare(a.data || "")).map((r) => (
            <tr key={r.id} style={rowStyle}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{maquinaById.get(r.maquinaId)?.nome || "-"}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.operador || "-"}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
              <td style={tdStyle} className="tl-mono">{r.horimetroInicio || "-"} → {r.horimetroFim || "-"}</td>
              <td style={tdStyle} className="tl-mono">{horasDe(r)}h</td>
              <td style={tdStyle}>{r.abastecida ? `${r.litros || 0} L` : "Não"}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <RowActions
                  onEdit={() => requireAdmin(() => setEditing(r))}
                  onDelete={() => requireAdmin(() => setDeleting(r))}
                />
              </td>
            </tr>
          ))}
        />
      )}

      {editing && <ControleDiarioForm initial={editing} maquinas={maquinas} onSave={save} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDelete label="este apontamento" dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
      {mostrarRelatorio && (
        <Modal title="Relatório — horas e litragem por máquina" onClose={() => setMostrarRelatorio(false)} wide>
          {relatorio.size === 0 ? (
            <p style={{ color: "var(--text-faint)", fontSize: "13px" }}>Nenhum dado para mostrar ainda.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[...relatorio.entries()].map(([maquinaId, acc]) => (
                <div
                  key={maquinaId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--bg-panel-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: "7px",
                    padding: "12px 14px",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{maquinaById.get(maquinaId)?.nome || "Sem máquina"}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-faint)" }}>{acc.dias} apontamento{acc.dias > 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: "24px", textAlign: "right" }}>
                    <div>
                      <div className="tl-display" style={{ fontSize: "20px", fontWeight: 700, color: "var(--amber)" }}>{acc.horas}h</div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-faint)" }}>trabalhadas</div>
                    </div>
                    <div>
                      <div className="tl-display" style={{ fontSize: "20px", fontWeight: 700 }}>{acc.litros}L</div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-faint)" }}>abastecidos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
            <Button variant="ghost" onClick={() => setMostrarRelatorio(false)}>Fechar</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ControleDiarioForm({ initial, maquinas, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    salvarRascunho("controle-diario", form);
  }, [form]);

  const horas = (() => {
    const ini = Number(form.horimetroInicio);
    const fim = Number(form.horimetroFim);
    if (isNaN(ini) || isNaN(fim) || fim < ini) return null;
    return fim - ini;
  })();

  return (
    <Modal title={initial.operador ? "Editar apontamento" : "Novo apontamento diário"} onClose={() => { limparRascunho("controle-diario"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form onSubmit={(e) => { e.preventDefault(); limparRascunho("controle-diario"); onSave(form); }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Máquina" required>
            <Select value={form.maquinaId} onChange={set("maquinaId")} required>
              <option value="">Selecionar</option>
              {porNome(maquinas).map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </Select>
          </Field>
          <Field label="Operador" required>
            <Input value={form.operador} onChange={set("operador")} required />
          </Field>
        </div>

        <Field label="Data">
          <Input type="date" value={form.data} onChange={set("data")} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Horímetro início do dia" required>
            <Input type="number" min="0" step="0.1" value={form.horimetroInicio} onChange={set("horimetroInicio")} required />
          </Field>
          <Field label="Horímetro fim do dia" required>
            <Input type="number" min="0" step="0.1" value={form.horimetroFim} onChange={set("horimetroFim")} required />
          </Field>
        </div>

        {horas !== null && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-panel-raised)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "9px 14px",
              marginBottom: "16px",
            }}
          >
            <span className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Horas trabalhadas</span>
            <span className="tl-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--amber)" }}>{horas}h</span>
          </div>
        )}

        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.abastecida} onChange={(e) => setForm({ ...form, abastecida: e.target.checked })} />
          <span style={{ fontSize: "13.5px" }}>A máquina foi abastecida hoje</span>
        </label>

        {form.abastecida && (
          <Field label="Litragem abastecida">
            <Input type="number" min="0" step="0.1" value={form.litros} onChange={set("litros")} />
          </Field>
        )}

        <Field label="Observação">
          <TextArea value={form.observacao} onChange={set("observacao")} />
        </Field>

        <FotosUpload fotos={form.fotos || []} onChange={(fotos) => setForm({ ...form, fotos })} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("controle-diario"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar apontamento</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Configurações módulo                                                */
/* ------------------------------------------------------------------ */
// Tira acentos e símbolos de um texto de cabeçalho, pra comparar de forma
// tolerante ("N° DO PEDIDO" e "Nº do Pedido" viram a mesma coisa).
function normalizarCabecalho(txt) {
  return String(txt || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Acha, dentro das primeiras linhas de uma planilha, a linha que parece ser
// o cabeçalho (a que contém um dos textos esperados), e devolve um mapa
// "nome da coluna normalizado" → índice da coluna.
function detectarCabecalho(matriz, candidatos) {
  for (let r = 0; r < Math.min(matriz.length, 15); r++) {
    const linha = (matriz[r] || []).map(normalizarCabecalho);
    if (candidatos.some((c) => linha.includes(c))) {
      const mapa = {};
      linha.forEach((v, i) => { if (v) mapa[v] = i; });
      return { linhaIdx: r, mapa };
    }
  }
  return null;
}

function pegar(linha, mapa, ...nomes) {
  for (const nome of nomes) {
    const i = mapa[nome];
    if (i !== undefined && linha[i] !== undefined && linha[i] !== null && linha[i] !== "") return linha[i];
  }
  return "";
}

async function lerExcelParaPacote(file) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });

  const acharPlanilha = (palavraChave) => wb.SheetNames.find((n) => normalizarCabecalho(n).includes(palavraChave));

  const nomeClientes = acharPlanilha("CLIENTES");
  const nomeEsc = acharPlanilha("PRODUCAO ESCAVADEIRA") || acharPlanilha("ESCAVADEIRA");
  const nomePerf = acharPlanilha("PRODUCAO PERFURATRIZ") || acharPlanilha("PERFURATRIZ");

  const paraData = (v) => {
    if (!v) return "";
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    // Proteção extra: se por algum motivo a data vier como número puro do
    // Excel (dias desde 30/12/1899), converte certinho em vez de tratar
    // como texto.
    if (typeof v === "number") {
      const convertida = XLSX.SSF.parse_date_code(v);
      if (convertida) {
        const mm = String(convertida.m).padStart(2, "0");
        const dd = String(convertida.d).padStart(2, "0");
        return `${convertida.y}-${mm}-${dd}`;
      }
    }
    return dataOrdenavel(v);
  };

  const clientes = [];
  if (nomeClientes) {
    const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomeClientes], { header: 1, raw: true });
    const cab = detectarCabecalho(matriz, ["N DO PEDIDO", "N PEDIDO", "PEDIDO"]);
    if (cab) {
      for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
        const linha = matriz[r] || [];
        const pedido = pegar(linha, cab.mapa, "N DO PEDIDO", "N PEDIDO", "PEDIDO");
        const nome = pegar(linha, cab.mapa, "EMPRESA", "NOME", "CONTATO");
        if (!pedido && !nome) continue;
        clientes.push({
          id: uid(),
          pedido: String(pedido).trim(),
          nome: String(nome || pegar(linha, cab.mapa, "CONTATO")).trim(),
          cpf: String(pegar(linha, cab.mapa, "CPF CNPJ", "CPF")).trim(),
          telefone: String(pegar(linha, cab.mapa, "TELEFONE")).trim(),
          email: String(pegar(linha, cab.mapa, "E MAIL")).trim(),
          endereco: String(pegar(linha, cab.mapa, "ENDERECO")).trim(),
          status: String(pegar(linha, cab.mapa, "STATUS")).trim() || "Ativo",
          observacao: String(pegar(linha, cab.mapa, "OBSERVACAO")).trim(),
        });
      }
    }
  }

  const lerProducao = (nomePlanilha) => {
    const registros = [];
    if (!nomePlanilha) return registros;
    const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomePlanilha], { header: 1, raw: true });
    const cab = detectarCabecalho(matriz, ["N DO PEDIDO", "N PEDIDO", "PEDIDO"]);
    if (!cab) return registros;
    for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
      const linha = matriz[r] || [];
      const pedido = pegar(linha, cab.mapa, "N DO PEDIDO", "N PEDIDO", "PEDIDO");
      const data = paraData(pegar(linha, cab.mapa, "DATA"));
      if (!pedido || !data) continue;
      const valorDiaria = numeroSeguro(pegar(linha, cab.mapa, "DIARIA"));
      const frete = numeroSeguro(pegar(linha, cab.mapa, "FRETE"));
      // "BOTA" é o valor de bota fora (descarte de material) — alinha com
      // a mesma seção "Retirada de material" usada no lançamento manual,
      // em vez de só somar escondido dentro do total sem aparecer em
      // lugar nenhum.
      const bota = numeroSeguro(pegar(linha, cab.mapa, "BOTA"));
      const totalLido = numeroSeguro(pegar(linha, cab.mapa, "TOTAL"));
      // Se a coluna TOTAL veio vazia/zerada mas diária, frete ou bota têm
      // valor, a fórmula da planilha provavelmente não tinha sido
      // recalculada — nesse caso, soma diária + frete + bota como
      // alternativa segura.
      const total = totalLido > 0 ? totalLido : valorDiaria + frete + bota;
      registros.push({
        id: uid(),
        pedido: String(pedido).trim(),
        data,
        cliente: String(pegar(linha, cab.mapa, "CLIENTE")).trim(),
        endereco: String(pegar(linha, cab.mapa, "ENDERECO")).trim(),
        equipamento: String(pegar(linha, cab.mapa, "EQUIPAMENTO")).trim(),
        qtdDias: Number(pegar(linha, cab.mapa, "QTD")) || 1,
        valorDiaria,
        frete,
        // Bota fora vira "Retirada de material" já preenchida, com o valor
        // a receber igual ao que veio da planilha — mesma seção que
        // aparece no lançamento manual, não um valor solto sem nome.
        retiradaMaterial: bota > 0 ? "Bota fora" : "",
        valorReceberRetirada: bota > 0 ? bota : "",
        qtdRetirada: bota > 0 ? 1 : "",
        operador: String(pegar(linha, cab.mapa, "OPERADOR")).trim(),
        vendedor: "",
        status: String(pegar(linha, cab.mapa, "STATUS", "PAGO")).trim().toUpperCase() || "EM ABERTO",
        total,
      });
    }
    return registros;
  };

  // Escavadeira: "N. PEDIDO" (sem "DO"), e os valores financeiros ficam
  // em colunas como "R$ DIÁRIA", "R$ FRETE", "R$ DIÁRIA TOTAL" e "SOMA R$
  // DE M² PERFURADO" — por isso essa leitura é separada.
  const lerProducaoPerfuratriz = (nomePlanilha) => {
    const registros = [];
    if (!nomePlanilha) return registros;
    const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomePlanilha], { header: 1, raw: true });
    const cab = detectarCabecalho(matriz, ["N PEDIDO", "N DO PEDIDO", "PEDIDO"]);
    if (!cab) return registros;
    for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
      const linha = matriz[r] || [];
      const pedido = pegar(linha, cab.mapa, "N PEDIDO", "N DO PEDIDO", "PEDIDO");
      const data = paraData(pegar(linha, cab.mapa, "DATA"));
      if (!pedido || !data) continue;
      const valorDiaria = numeroSeguro(pegar(linha, cab.mapa, "R DIARIA"));
      const frete = numeroSeguro(pegar(linha, cab.mapa, "R FRETE", "FRETE"));
      const totalDiaria = numeroSeguro(pegar(linha, cab.mapa, "R DIARIA TOTAL"));
      const totalM2 = numeroSeguro(pegar(linha, cab.mapa, "SOMA R DE M PERFURADO", "SOMA R DE M2 PERFURADO"));
      const totalLido = numeroSeguro(pegar(linha, cab.mapa, "TOTAL"));
      const metragem = pegar(linha, cab.mapa, "M PERFURADO", "M2 PERFURADO") || pegar(linha, cab.mapa, "QTD DE FUROS");
      // Total = soma dos componentes financeiros (diária + m² perfurado +
      // frete). Se por acaso existir uma coluna "TOTAL" simples também,
      // usa o maior dos dois — nunca aceita ficar em zero se algum
      // componente tiver valor.
      const totalCalculado = totalDiaria + totalM2 + frete || valorDiaria + frete;
      const total = Math.max(totalLido, totalCalculado);
      registros.push({
        id: uid(),
        pedido: String(pedido).trim(),
        data,
        cliente: String(pegar(linha, cab.mapa, "CLIENTE")).trim(),
        endereco: String(pegar(linha, cab.mapa, "ENDERECO")).trim(),
        equipamento: String(pegar(linha, cab.mapa, "EQUIPAMENTO")).trim(),
        qtdDias: Number(pegar(linha, cab.mapa, "QTD")) || 1,
        metragem: metragem ? String(metragem).trim() : "",
        valorDiaria,
        frete,
        operador: String(pegar(linha, cab.mapa, "OPERADOR")).trim(),
        vendedor: "",
        status: String(pegar(linha, cab.mapa, "STATUS")).trim().toUpperCase() || "EM ABERTO",
        total,
      });
    }
    return registros;
  };

  const nomeFinanceiro = acharPlanilha("FLUXO DE CAIXA");
  const financeiro = [];
  if (nomeFinanceiro) {
    const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomeFinanceiro], { header: 1, raw: true });
    const cab = detectarCabecalho(matriz, ["DESCRICAO", "TIPO"]);
    if (cab) {
      for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
        const linha = matriz[r] || [];
        const descricao = pegar(linha, cab.mapa, "DESCRICAO");
        const valor = pegar(linha, cab.mapa, "VALOR");
        if (!descricao && !valor) continue;
        const situacaoRaw = String(pegar(linha, cab.mapa, "SITUACAO")).toUpperCase();
        const status = situacaoRaw.includes("PAGO") ? "Pago" : "Pendente";
        const documento = String(pegar(linha, cab.mapa, "NDOCUMENTO", "N DOCUMENTO")).trim();
        const obs = String(pegar(linha, cab.mapa, "OBSERVACAO")).trim();
        // A coluna TIPO diz se é conta a pagar ou a receber — sem isso, tudo
        // ia parar em "Pagar" só porque era o padrão, mesmo quando a planilha
        // já dizia claramente que era uma entrada (a receber).
        const tipoRaw = String(pegar(linha, cab.mapa, "TIPO")).toUpperCase();
        const tipo = tipoRaw.includes("RECEB") || tipoRaw.includes("RECEITA") || tipoRaw.includes("ENTRADA") ? "Receber" : "Pagar";
        financeiro.push({
          id: uid(),
          tipo,
          descricao: String(descricao).trim(),
          fornecedor: String(descricao).trim(),
          pedido: "",
          valor: numeroSeguro(valor),
          vencimento: paraData(pegar(linha, cab.mapa, "DATA DE VENCIMENTO", "VENCIMENTO")) || paraData(pegar(linha, cab.mapa, "DATA DE LANCAMENTO")),
          dataPagamento: paraData(pegar(linha, cab.mapa, "DATA DE PAGAMENTO")),
          status,
          formaPagamento: String(pegar(linha, cab.mapa, "FORMA DE PAGAMENTO")).trim(),
          observacao: [documento && `Documento: ${documento}`, obs].filter(Boolean).join(" · "),
        });
      }
    }
  }

  const nomeManutencao = acharPlanilha("MANUTENCAO E ABASTECIMENTO") || acharPlanilha("MANUTENCAO");
  const manutencoes = [];
  if (nomeManutencao) {
    const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomeManutencao], { header: 1, raw: true });
    const cab = detectarCabecalho(matriz, ["EQUIPAMENTO", "DESCRICAO"]);
    if (cab) {
      for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
        const linha = matriz[r] || [];
        const equipamentoNome = pegar(linha, cab.mapa, "EQUIPAMENTO");
        const data = paraData(pegar(linha, cab.mapa, "DATA"));
        if (!equipamentoNome && !data) continue;
        const tipoRaw = String(pegar(linha, cab.mapa, "MANUTENCAO OU ABASTECIMENTO")).toUpperCase();
        manutencoes.push({
          id: uid(),
          maquinaNome: String(equipamentoNome).trim(),
          tipo: tipoRaw.includes("ABASTEC") ? "Abastecimento" : "Manutenção",
          data,
          descricao: String(pegar(linha, cab.mapa, "DESCRICAO")).trim(),
          horimetro: String(pegar(linha, cab.mapa, "HORIMETRO ATUAL")).trim(),
          litros: numeroSeguro(pegar(linha, cab.mapa, "LITROS")) || "",
          valor: numeroSeguro(pegar(linha, cab.mapa, "VALOR")),
          observacao: String(pegar(linha, cab.mapa, "OBSERVACAO")).trim(),
          fotos: [],
        });
      }
    }
  }

  const nomeTarefa = acharPlanilha("TAREFA");
  const agenda = [];
  if (nomeTarefa) {
    // Essa aba é diferente das outras: uma linha por dia, com até várias
    // colunas de compromissos daquele dia (uma célula = um compromisso).
    const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomeTarefa], { header: 1, raw: true });
    for (let r = 0; r < matriz.length; r++) {
      const linha = matriz[r] || [];
      const data = paraData(linha[0]);
      if (!data || !/^\d{4}-\d{2}-\d{2}/.test(data)) continue;
      for (let c = 1; c < linha.length; c++) {
        const texto = String(linha[c] || "").trim();
        if (!texto) continue;
        agenda.push({
          id: uid(),
          titulo: texto,
          tipo: "Compromisso",
          data,
          hora: "",
          maquinaId: "",
          pedido: "",
          observacao: "",
          status: "Pendente",
        });
      }
    }
  }

  return {
    clientes,
    producaoEsc: lerProducao(nomeEsc),
    producaoPerf: lerProducaoPerfuratriz(nomePerf),
    financeiro,
    manutencoes,
    agenda,
  };
}

function ImportarDadosSection({ clientes, producaoEsc, producaoPerf, financeiro, manutencoes, agenda, maquinas, onImportarClientes, onImportarProducaoEsc, onImportarProducaoPerf, onImportarFinanceiro, onImportarManutencoes, onImportarAgenda }) {
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const fileRef = React.useRef(null);

  const chaveCliente = (c) => `${String(c.pedido).trim()}|${String(c.nome).trim().toLowerCase()}`;
  const chaveProducao = (r) => `${String(r.pedido).trim()}|${String(r.data).trim()}|${String(r.equipamento).trim().toLowerCase()}`;
  // Sem o valor na chave — assim, se o valor de uma conta for corrigido
  // numa reimportação, o sistema entende que é a MESMA conta (não cria
  // uma duplicata só porque o número mudou).
  const chaveFinanceiro = (c) => `${String(c.tipo).trim().toLowerCase()}|${String(c.descricao).trim().toLowerCase()}|${String(c.vencimento).trim()}`;
  const chaveManutencao = (r) => `${String(r.maquinaNome || "").trim().toLowerCase()}|${String(r.data).trim()}|${String(r.tipo).trim()}|${String(r.descricao).trim().toLowerCase()}`;
  const chaveAgenda = (r) => `${String(r.data).trim()}|${String(r.titulo).trim().toLowerCase()}`;

  const resolverMaquinaId = (nome) => {
    const alvo = String(nome || "").trim().toLowerCase();
    const achada = (maquinas || []).find((m) => m.nome.trim().toLowerCase() === alvo);
    return achada?.id || "";
  };

  const processarArquivo = async (file) => {
    setProcessando(true);
    setErro("");
    setResultado(null);
    try {
      const ehExcel = /\.(xlsx|xlsm|xls)$/i.test(file.name);
      let pacote;
      if (ehExcel) {
        try {
          pacote = await lerExcelParaPacote(file);
        } catch (e) {
          setErro("A leitura de Excel só funciona no site publicado (não nesta pré-visualização do Claude). Se estiver testando aqui, use um arquivo .json.");
          setProcessando(false);
          return;
        }
      } else {
        const texto = await file.text();
        pacote = JSON.parse(texto);
      }

      const existentesCliente = new Set(clientes.map(chaveCliente));
      const novosClientes = (pacote.clientes || []).filter((c) => c.pedido && c.nome && !existentesCliente.has(chaveCliente(c)));

      const existentesEsc = new Set(producaoEsc.map(chaveProducao));
      const novosEsc = (pacote.producaoEsc || []).filter((r) => r.pedido && r.data && !existentesEsc.has(chaveProducao(r)));

      const existentesPerf = new Set(producaoPerf.map(chaveProducao));
      const novosPerf = (pacote.producaoPerf || []).filter((r) => r.pedido && r.data && !existentesPerf.has(chaveProducao(r)));

      const existentesFin = new Set((financeiro || []).map(chaveFinanceiro));
      const novosFinanceiro = (pacote.financeiro || []).filter((c) => c.descricao && !existentesFin.has(chaveFinanceiro(c)));

      const existentesManut = new Set((manutencoes || []).map(chaveManutencao));
      const novasManutencoes = (pacote.manutencoes || [])
        .filter((r) => r.maquinaNome && r.data && !existentesManut.has(chaveManutencao(r)))
        .map((r) => ({ ...r, maquinaId: resolverMaquinaId(r.maquinaNome) }));

      const existentesAgenda = new Set((agenda || []).map(chaveAgenda));
      const novaAgenda = (pacote.agenda || []).filter((r) => r.data && r.titulo && !existentesAgenda.has(chaveAgenda(r)));

      // A planilha usa fórmulas pra puxar o nome do cliente em cada linha de
      // produção — quando essa fórmula falha (cliente não encontrado na hora),
      // ela grava literalmente "0". Em vez de confiar nesse texto, a gente
      // sempre recalcula o cliente certo aqui, batendo o pedido contra a
      // lista de clientes atual (incluindo os que acabaram de ser importados
      // agora mesmo).
      const todosClientesAtualizados = [...clientes, ...novosClientes];
      const buscarClientePorPedido = (pedido) =>
        todosClientesAtualizados.find((c) => String(c.pedido).trim() === String(pedido).trim());

      const corrigirClienteEndereco = (registros) =>
        registros.map((r) => {
          const cli = buscarClientePorPedido(r.pedido);
          return {
            ...r,
            cliente: cli ? cli.nome : (r.cliente && r.cliente !== "0" ? r.cliente : "-"),
            endereco: cli ? cli.endereco : (r.endereco && r.endereco !== "0" ? r.endereco : "-"),
          };
        });

      const novosEscCorrigidos = corrigirClienteEndereco(novosEsc);
      const novosPerfCorrigidos = corrigirClienteEndereco(novosPerf);

      setResultado({ novosClientes, novosEsc: novosEscCorrigidos, novosPerf: novosPerfCorrigidos, novosFinanceiro, novasManutencoes, novaAgenda, pacote });
    } catch (e) {
      setErro("Não consegui ler esse arquivo. Confirme que é uma planilha (.xlsx, .xlsm) ou um .json preparado corretamente.");
    }
    setProcessando(false);
  };

  const confirmarImportacao = async () => {
    if (!resultado) return;
    setProcessando(true);
    if (resultado.novosClientes.length > 0) {
      await onImportarClientes([...clientes, ...resultado.novosClientes.map((c) => ({ ...c, id: uid() }))]);
    }
    // Gera, na hora, a conta de Financeiro correspondente a cada lançamento
    // de Produção importado — sem esperar o processo de sincronização
    // automática rodar depois, que é assíncrono e podia dar a impressão de
    // que "não puxou" o Financeiro logo após importar.
    let contasGeradasDeProducao = [];
    if (resultado.novosEsc.length > 0) {
      const novosEscComId = resultado.novosEsc.map((r) => ({ ...r, id: uid() }));
      await onImportarProducaoEsc([...producaoEsc, ...novosEscComId]);
      contasGeradasDeProducao.push(...novosEscComId.map((r) => gerarContaFinanceiraDeProducao(r, "Escavadeira")));
    }
    if (resultado.novosPerf.length > 0) {
      const novosPerfComId = resultado.novosPerf.map((r) => ({ ...r, id: uid() }));
      await onImportarProducaoPerf([...producaoPerf, ...novosPerfComId]);
      contasGeradasDeProducao.push(...novosPerfComId.map((r) => gerarContaFinanceiraDeProducao(r, "Perfuratriz")));
    }
    const contasManuais = resultado.novosFinanceiro.length > 0 ? resultado.novosFinanceiro.map((c) => ({ ...c, id: uid() })) : [];
    if (contasGeradasDeProducao.length > 0 || contasManuais.length > 0) {
      await onImportarFinanceiro([...financeiro, ...contasGeradasDeProducao, ...contasManuais]);
    }
    if (resultado.novasManutencoes.length > 0) {
      // Mantém o nome do equipamento como veio da planilha, mesmo quando o
      // sistema não conseguiu casar com nenhuma máquina cadastrada — assim
      // a informação não se perde, e dá pra corrigir depois.
      await onImportarManutencoes([...manutencoes, ...resultado.novasManutencoes.map((r) => ({ ...r, id: uid() }))]);
    }
    if (resultado.novaAgenda.length > 0) {
      await onImportarAgenda([...agenda, ...resultado.novaAgenda.map((r) => ({ ...r, id: uid() }))]);
    }
    await registrarLog(
      "Importação",
      `${resultado.novosClientes.length} clientes, ${resultado.novosEsc.length} produção esc., ${resultado.novosPerf.length} produção perf. (${contasGeradasDeProducao.length} conta(s) no Financeiro geradas junto), ${contasManuais.length} financeiro manual, ${resultado.novasManutencoes.length} manutenção, ${resultado.novaAgenda.length} agenda`
    );
    setProcessando(false);
    setResultado({ ...resultado, concluido: true });
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Upload size={18} style={{ color: "var(--amber)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Importar dados</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Adiciona clientes, produção, financeiro e manutenção direto de uma planilha Excel (.xlsx, .xlsm) — ou de um arquivo .json preparado. Só adiciona o que ainda não existe no sistema — nunca duplica nem substitui nada.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xlsm,.xls,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && processarArquivo(e.target.files[0])}
      />
      <Button icon={Upload} variant="subtle" disabled={processando} onClick={() => fileRef.current?.click()}>
        {processando ? "Processando..." : "Escolher arquivo (.xlsx, .xlsm ou .json)"}
      </Button>

      {erro && <p style={{ fontSize: "12.5px", color: "var(--danger)", marginTop: "12px" }}>{erro}</p>}

      {resultado && !resultado.concluido && (
        <div style={{ marginTop: "16px", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "7px", padding: "14px" }}>
          <p style={{ fontSize: "13px", marginBottom: "10px" }}>Encontrado pra importar:</p>
          <ul style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", paddingLeft: "18px" }}>
            <li>{resultado.novosClientes.length} cliente(s) novo(s)</li>
            <li>{resultado.novosEsc.length} lançamento(s) novo(s) de Produção</li>
            <li>{resultado.novosFinanceiro.length} conta(s) nova(s) no Financeiro</li>
            <li>{resultado.novasManutencoes.length} registro(s) novo(s) de Manutenção/Abastecimento</li>
            <li>{resultado.novaAgenda.length} compromisso(s) novo(s) na Agenda</li>
          </ul>

          {resultado.novosEsc.length > 0 && (
            <PreviaImportacao titulo="Prévia — Produção (3 primeiras linhas novas)" itens={resultado.novosEsc} />
          )}
          {resultado.novosClientes.length > 0 && (
            <PreviaImportacaoCliente titulo="Prévia — Clientes (3 primeiros novos)" itens={resultado.novosClientes} />
          )}
          {resultado.novosFinanceiro.length > 0 && (
            <PreviaImportacaoFinanceiro titulo="Prévia — Financeiro (3 primeiras contas novas)" itens={resultado.novosFinanceiro} />
          )}
          {resultado.novasManutencoes.length > 0 && (
            <PreviaImportacaoManutencao titulo="Prévia — Manutenção/Abastecimento (3 primeiros novos)" itens={resultado.novasManutencoes} />
          )}

          {(resultado.novosClientes.length + resultado.novosEsc.length + resultado.novosPerf.length + resultado.novosFinanceiro.length + resultado.novasManutencoes.length + resultado.novaAgenda.length) === 0 ? (
            <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nada novo pra importar — tudo desse arquivo já está no sistema.</p>
          ) : (
            <Button size="sm" onClick={confirmarImportacao} disabled={processando}>
              {processando ? "Importando..." : "Confirmar importação"}
            </Button>
          )}
        </div>
      )}
      {resultado?.concluido && (
        <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "12px" }}>✓ Importação concluída com sucesso.</p>
      )}
    </div>
  );
}

function PreviaImportacaoFinanceiro({ titulo, itens }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginBottom: "6px", textTransform: "uppercase" }}>{titulo}</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
          <thead>
            <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
              <th style={{ padding: "4px 8px" }}>Descrição</th>
              <th style={{ padding: "4px 8px" }}>Valor</th>
              <th style={{ padding: "4px 8px" }}>Vencimento</th>
              <th style={{ padding: "4px 8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {itens.slice(0, 3).map((it, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--border-soft)" }}>
                <td style={{ padding: "4px 8px" }}>{it.descricao || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{money(it.valor)}</td>
                <td style={{ padding: "4px 8px" }}>{it.vencimento || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreviaImportacaoManutencao({ titulo, itens }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginBottom: "6px", textTransform: "uppercase" }}>{titulo}</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
          <thead>
            <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
              <th style={{ padding: "4px 8px" }}>Máquina</th>
              <th style={{ padding: "4px 8px" }}>Tipo</th>
              <th style={{ padding: "4px 8px" }}>Data</th>
              <th style={{ padding: "4px 8px" }}>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {itens.slice(0, 3).map((it, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--border-soft)" }}>
                <td style={{ padding: "4px 8px" }}>{it.maquinaNome || "-"}{!it.maquinaId && <span style={{ color: "var(--danger)" }}> (sem cadastro)</span>}</td>
                <td style={{ padding: "4px 8px" }}>{it.tipo || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.data || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.descricao || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreviaImportacao({ titulo, itens }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginBottom: "6px", textTransform: "uppercase" }}>{titulo}</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
          <thead>
            <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
              <th style={{ padding: "4px 8px" }}>Pedido</th>
              <th style={{ padding: "4px 8px" }}>Data</th>
              <th style={{ padding: "4px 8px" }}>Cliente</th>
              <th style={{ padding: "4px 8px" }}>Equipamento</th>
              <th style={{ padding: "4px 8px" }}>Operador</th>
              <th style={{ padding: "4px 8px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {itens.slice(0, 3).map((it, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--border-soft)" }}>
                <td style={{ padding: "4px 8px" }}>{it.pedido || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.data || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.cliente || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.equipamento || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.operador || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{money(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreviaImportacaoCliente({ titulo, itens }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginBottom: "6px", textTransform: "uppercase" }}>{titulo}</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
          <thead>
            <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
              <th style={{ padding: "4px 8px" }}>Pedido</th>
              <th style={{ padding: "4px 8px" }}>Nome</th>
              <th style={{ padding: "4px 8px" }}>Telefone</th>
              <th style={{ padding: "4px 8px" }}>Endereço</th>
              <th style={{ padding: "4px 8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {itens.slice(0, 3).map((it, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--border-soft)" }}>
                <td style={{ padding: "4px 8px" }}>{it.pedido || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.nome || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.telefone || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.endereco || "-"}</td>
                <td style={{ padding: "4px 8px" }}>{it.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function CorrigirClientesDuplicadosSection({ clientes, onChangeClientes }) {
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState("");
  const [preview, setPreview] = useState(null);

  const normalizar = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");

  const analisar = () => {
    setResultado("");
    // 1) Quem não tem nº de pedido recebe o próximo disponível, em ordem.
    const numeros = clientes.map((c) => parseInt(String(c.pedido).replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
    let proximo = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
    const semPedido = clientes.filter((c) => !String(c.pedido || "").trim()).length;

    const comPedido = clientes.map((c) => {
      if (String(c.pedido || "").trim()) return c;
      const atribuido = String(proximo);
      proximo++;
      return { ...c, pedido: atribuido };
    });

    // 2) Duplicata = mesmo nome E mesmo endereço (normalizados). Nome igual
    // com endereço diferente NÃO é considerado duplicata — pode ser outra
    // obra/local do mesmo cliente.
    const grupos = new Map();
    comPedido.forEach((c) => {
      const chave = `${normalizar(c.nome)}|${normalizar(c.endereco)}`;
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(c);
    });

    const duplicatas = [];
    grupos.forEach((grupo) => {
      if (grupo.length > 1) duplicatas.push(grupo);
    });

    setPreview({ comPedido, semPedidoCorrigido: semPedido, duplicatas });
  };

  const aplicar = async () => {
    if (!preview) return;
    setProcessando(true);
    const final = [];
    const grupos = new Map();
    preview.comPedido.forEach((c) => {
      const chave = `${normalizar(c.nome)}|${normalizar(c.endereco)}`;
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(c);
    });
    let removidas = 0;
    grupos.forEach((grupo) => {
      if (grupo.length === 1) {
        final.push(grupo[0]);
      } else {
        removidas += grupo.length - 1;
        // Mantém o registro mais completo (mais campos preenchidos) do grupo.
        const melhor = grupo.reduce((a, b) =>
          Object.values(b).filter((v) => v !== "" && v !== null && v !== undefined).length >
          Object.values(a).filter((v) => v !== "" && v !== null && v !== undefined).length
            ? b
            : a
        );
        final.push(melhor);
      }
    });
    await onChangeClientes(final);
    setProcessando(false);
    setResultado(`✓ ${preview.semPedidoCorrigido} cliente(s) receberam nº de pedido · ${removidas} duplicata(s) removida(s).`);
    setPreview(null);
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>Corrigir clientes sem pedido e duplicados</h3>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "600px" }}>
        Atribui automaticamente um número de pedido pra quem está sem, e identifica clientes duplicados — considerando
        duplicata apenas quando o <strong>nome e o endereço</strong> forem iguais (nome repetido com endereço diferente não
        é mexido, pode ser outra obra do mesmo cliente).
      </p>

      {!preview ? (
        <Button icon={Search} variant="subtle" disabled={processando} onClick={analisar}>
          Analisar clientes
        </Button>
      ) : (
        <div>
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "14px", marginBottom: "14px" }}>
            <p style={{ fontSize: "13px", marginBottom: "8px" }}>
              <strong>{preview.semPedidoCorrigido}</strong> cliente(s) sem pedido vão receber um número novo.
            </p>
            {preview.duplicatas.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--success)" }}>Nenhuma duplicata encontrada (nome + endereço iguais).</p>
            ) : (
              <>
                <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                  <strong>{preview.duplicatas.length}</strong> grupo(s) de duplicata encontrados:
                </p>
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {preview.duplicatas.map((grupo, i) => (
                    <div key={i} style={{ fontSize: "12px", color: "var(--text-muted)", padding: "6px 0", borderBottom: "1px solid var(--border-soft)" }}>
                      <strong style={{ color: "var(--text-primary)" }}>{grupo[0].nome}</strong> — {grupo[0].endereco || "sem endereço"} ({grupo.length}x, pedidos: {grupo.map((c) => c.pedido).join(", ")})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button disabled={processando} onClick={aplicar}>{processando ? "Aplicando..." : "Aplicar correção"}</Button>
            <Button variant="ghost" onClick={() => setPreview(null)}>Cancelar</Button>
          </div>
        </div>
      )}
      {resultado && <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "10px" }}>{resultado}</p>}
    </div>
  );
}

function ZerarFinanceiroSection({ financeiro, onChangeFinanceiro }) {
  const [confirmando, setConfirmando] = useState(false);
  const [feito, setFeito] = useState(false);

  const zerar = async () => {
    await onChangeFinanceiro([]);
    setConfirmando(false);
    setFeito(true);
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid #5A2020", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <AlertTriangle size={18} style={{ color: "var(--danger)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Zerar Financeiro</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Apaga <strong>todos</strong> os lançamentos de Contas a Pagar e a Receber, pra você reimportar do zero com a planilha
        atualizada. Não afeta Produção, Manutenção, Clientes nem o resto do sistema — só o Financeiro.
      </p>
      {!confirmando ? (
        <Button icon={Trash2} variant="subtle" style={{ color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => setConfirmando(true)}>
          Zerar Financeiro ({financeiro.length} lançamento{financeiro.length === 1 ? "" : "s"})
        </Button>
      ) : (
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "var(--danger)", fontWeight: 600 }}>
            Tem certeza? Isso apaga {financeiro.length} lançamento(s) sem volta.
          </span>
          <Button variant="subtle" style={{ background: "var(--danger)", color: "#fff", borderColor: "var(--danger)" }} onClick={zerar}>
            Sim, apagar tudo
          </Button>
          <Button variant="ghost" onClick={() => setConfirmando(false)}>Cancelar</Button>
        </div>
      )}
      {feito && <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "10px" }}>✓ Financeiro zerado. Já pode importar a planilha nova.</p>}
    </div>
  );
}

function BackupSection() {
  const [baixando, setBaixando] = useState(false);
  const [feito, setFeito] = useState("");

  const baixar = async () => {
    setBaixando(true);
    setFeito("");
    try {
      const deuCertoExcel = await baixarBackupExcel();
      if (deuCertoExcel) {
        setFeito("✓ Backup baixado em Excel com sucesso.");
      } else {
        await baixarBackupCompleto();
        setFeito("✓ Backup baixado em JSON (o Excel só funciona no site publicado, não nesta pré-visualização).");
      }
      setTimeout(() => setFeito(""), 6000);
    } catch (e) {
      window.alert("Não consegui gerar o backup agora. Verifique sua internet e tente de novo.");
    }
    setBaixando(false);
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Download size={18} style={{ color: "var(--amber)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Backup</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Baixa uma cópia completa de todos os dados do sistema (clientes, produção, financeiro, tudo) numa planilha Excel — cada área do sistema vira uma aba. Guarde esse arquivo num lugar seguro — Google Drive, e-mail pra si mesmo, pen drive. Recomendado fazer isso pelo menos uma vez por semana.
      </p>
      <Button icon={Download} onClick={baixar} disabled={baixando}>
        {baixando ? "Gerando backup..." : "Baixar backup completo"}
      </Button>
      {feito && <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "10px" }}>{feito}</p>}
    </div>
  );
}

// Diferente de "Importar dados" (que só soma o que ainda não existe),
// isso SUBSTITUI por completo os dados de uma área — pra quando algo deu
// errado e você tem um backup .json confiável que reflete o estado
// correto de antes do problema.
function RestaurarBackupSection({
  onChangeClientes,
  onChangeProducaoEsc,
  onChangeProducaoPerf,
  onChangeFinanceiro,
  onChangeManutencoes,
  onChangeAgenda,
  onChangeMaquinas,
  onChangeOperadores,
  onChangeVendedores,
  onChangeStatusClientes,
  onChangeFuncionarios,
  onChangeMotoristas,
  onChangeCaminhoes,
  onChangeEmpresasRetirada,
  requireAdmin,
}) {
  const [arquivo, setArquivo] = useState(null);
  const [dadosBackup, setDadosBackup] = useState(null);
  const [selecionados, setSelecionados] = useState({});
  const [erro, setErro] = useState("");
  const [restaurando, setRestaurando] = useState(false);
  const [feito, setFeito] = useState("");
  const fileRef = useRef(null);

  const AREAS = [
    { key: "clientes", label: "Clientes", onChange: onChangeClientes },
    { key: "producaoEsc", label: "Produção Concreto", onChange: onChangeProducaoEsc },
    { key: "financeiro", label: "Financeiro", onChange: onChangeFinanceiro },
    { key: "manutencoes", label: "Manutenção", onChange: onChangeManutencoes },
    { key: "agenda", label: "Agenda", onChange: onChangeAgenda },
    { key: "maquinas", label: "Betoneiras", onChange: onChangeMaquinas },
    { key: "vendedores", label: "Vendedores", onChange: onChangeVendedores },
    { key: "statusClientes", label: "Status de clientes", onChange: onChangeStatusClientes },
    { key: "funcionarios", label: "Funcionários", onChange: onChangeFuncionarios },
    { key: "motoristas", label: "Motoristas", onChange: onChangeMotoristas },
    { key: "caminhoes", label: "Caminhões", onChange: onChangeCaminhoes },
  ];

  const lerArquivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErro("");
    setFeito("");
    setDadosBackup(null);
    setSelecionados({});
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        setDadosBackup(json);
        setArquivo(file.name);
      } catch (err) {
        setErro("Não consegui ler esse arquivo — confirme que é um backup .json gerado por esse sistema (o botão \"Baixar backup completo\" ali em cima).");
      }
    };
    reader.readAsText(file);
  };

  const toggleArea = (key) => setSelecionados((s) => ({ ...s, [key]: !s[key] }));

  const restaurar = () => {
    const areasEscolhidas = AREAS.filter((a) => selecionados[a.key] && Array.isArray(dadosBackup[a.key]));
    if (areasEscolhidas.length === 0) return;
    requireAdmin(async () => {
      setRestaurando(true);
      for (const area of areasEscolhidas) {
        await area.onChange(dadosBackup[area.key]);
      }
      await registrarLog(
        "Restauração de backup",
        `Substituiu por completo: ${areasEscolhidas.map((a) => a.label).join(", ")} (arquivo: ${arquivo})`
      );
      setFeito(`✓ Restaurado com sucesso: ${areasEscolhidas.map((a) => a.label).join(", ")}.`);
      setRestaurando(false);
      setDadosBackup(null);
      setSelecionados({});
      setArquivo(null);
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  const areasNoArquivo = dadosBackup ? AREAS.filter((a) => Array.isArray(dadosBackup[a.key])) : [];
  const algumaMarcada = Object.values(selecionados).some(Boolean);

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid #E8A63D", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Upload size={18} style={{ color: "var(--amber)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Restaurar backup</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Use isso quando algo deu errado e você tem um backup .json confiável de antes do problema. Diferente de "Importar dados" (que só soma), isso <strong>substitui por completo</strong> os dados da área escolhida pelo que está no arquivo — não tem como desfazer depois de confirmado.
      </p>

      <input ref={fileRef} type="file" accept=".json" onChange={lerArquivo} style={{ marginBottom: "16px" }} />

      {erro && <p style={{ fontSize: "12.5px", color: "var(--danger)", marginBottom: "12px" }}>{erro}</p>}

      {dadosBackup && (
        <div>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "10px" }}>
            Backup de {dadosBackup._geradoEm ? new Date(dadosBackup._geradoEm).toLocaleString("pt-BR") : "data desconhecida"}. Marque o que substituir:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "16px" }}>
            {areasNoArquivo.map((a) => (
              <label key={a.key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input type="checkbox" checked={!!selecionados[a.key]} onChange={() => toggleArea(a.key)} />
                {a.label} <span style={{ color: "var(--text-faint)" }}>({dadosBackup[a.key].length} registro{dadosBackup[a.key].length === 1 ? "" : "s"} no backup)</span>
              </label>
            ))}
          </div>
          <Button variant="danger" onClick={restaurar} disabled={restaurando || !algumaMarcada}>
            {restaurando ? "Restaurando..." : "Substituir as áreas marcadas"}
          </Button>
        </div>
      )}

      {feito && <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "10px" }}>{feito}</p>}
    </div>
  );
}

// Corrige o status (EM ABERTO / BOLETO / PIX / PAGO) dos lançamentos de
// Produção comparando linha por linha com a planilha original — usa a
// mesma chave (pedido + data + equipamento) que o "Importar dados" já usa,
// pra achar exatamente o registro certo mesmo quando o mesmo pedido tem
// vários lançamentos com status diferentes entre si. Ao corrigir o status
// na Produção, o Financeiro se ajusta sozinho (já é sincronizado daqui).
// Compara linha por linha a planilha original com o que está no app, em
// 4 áreas diferentes ao mesmo tempo — e corrige só o que estiver
// diferente, sem apagar nem duplicar nada. Corrigir o status da Produção
// já ajusta o Financeiro (Contas a Receber) sozinho, por isso essas duas
// áreas aparecem juntas num preview só.
const STATUS_CANONICO = { ATIVO: "Ativo", INATIVO: "Inativo", POTENCIAL: "Potencial" };
const normalizarStatusCliente = (v) => {
  const limpo = String(v || "").trim();
  return STATUS_CANONICO[limpo.toUpperCase()] || limpo;
};
const STATUS_FINANCEIRO_PLANILHA = { PAGO: "Pago", "EM ABERTO": "Pendente", ATRASADO: "Pendente" };

// Revisa lançamentos marcados como PAGO onde o "valor pago" salvo é menor
// que o total calculado agora — pode ser um pagamento parcial de verdade,
// ou pode ser sobra do bug antigo (quando marcava PAGO antes de terminar
// de preencher os campos). Mostra um por um pra decidir, não corrige tudo
// sozinho sem confirmação.
function RevisarPagamentosSection({ producaoEsc, producaoPerf, onChangeProducaoEsc, onChangeProducaoPerf }) {
  const [ignorados, setIgnorados] = useState(new Set());

  const divergentes = useMemo(() => {
    const deLista = (lista, origem) =>
      lista
        .filter((r) => r.status === "PAGO")
        .map((r) => ({ ...r, origem, totalCalculado: calcularTotalProducao(r) }))
        .filter((r) => {
          const valorPago = r.valorPago !== "" && r.valorPago !== undefined ? numeroSeguro(r.valorPago) : r.totalCalculado;
          return r.totalCalculado - valorPago > 0.005;
        });
    return [...deLista(producaoEsc, "Concreto")].filter((r) => !ignorados.has(r.id));
  }, [producaoEsc, producaoPerf, ignorados]);

  const corrigirParaIntegral = (item) => {
    const atualizar = (lista, onChange) => {
      if (!lista.some((r) => r.id === item.id)) return false;
      onChange(lista.map((r) => (r.id === item.id ? { ...r, valorPago: item.totalCalculado, dataProximoPagamento: "" } : r)));
      return true;
    };
    if (!atualizar(producaoEsc, onChangeProducaoEsc)) atualizar(producaoPerf, onChangeProducaoPerf);
  };

  const ignorar = (id) => setIgnorados((s) => new Set([...s, id]));

  if (divergentes.length === 0) {
    return (
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <Check size={18} style={{ color: "var(--success)" }} />
          <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Valores pagos em dia</h3>
        </div>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
          Nenhum lançamento marcado como PAGO com o valor pago desatualizado no momento.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <AlertTriangle size={18} style={{ color: "var(--amber)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Revisar valores pagos ({divergentes.length})</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Esses lançamentos estão como PAGO, mas o "valor pago" salvo é menor que o total calculado agora — pode ser um pagamento parcial de verdade, ou sobra de um bug antigo já corrigido. Confere um por um: se foi pagamento integral, corrige; se foi parcial mesmo, ignora.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {divergentes.map((item) => {
          const valorPagoSalvo = item.valorPago !== "" && item.valorPago !== undefined ? numeroSeguro(item.valorPago) : 0;
          return (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", fontSize: "13px" }}>
              <div>
                <strong>Pedido #{item.pedido || "-"}</strong>
                <span style={{ color: "var(--text-muted)" }}> · {item.origem} · {fmtDate(item.data)} · {item.cliente || "-"}</span>
                <div style={{ fontSize: "11.5px", color: "var(--text-faint)", marginTop: "2px" }}>
                  Pago salvo: <strong className="tl-mono">{money(valorPagoSalvo)}</strong> — Total calculado: <strong className="tl-mono">{money(item.totalCalculado)}</strong>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => ignorar(item.id)}
                  className="tl-focus"
                  style={{ background: "none", border: "1px solid var(--border-soft)", borderRadius: "5px", padding: "6px 10px", fontSize: "12px", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  Ignorar (foi parcial mesmo)
                </button>
                <button
                  onClick={() => corrigirParaIntegral(item)}
                  className="tl-focus"
                  style={{ background: "var(--accent)", color: "var(--accent-text)", border: "none", borderRadius: "5px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Corrigir pra pago integral
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SincronizarPlanilhaSection({
  clientes,
  producaoEsc,
  producaoPerf,
  financeiro,
  onChangeClientes,
  onChangeProducaoEsc,
  onChangeProducaoPerf,
  onChangeFinanceiro,
  requireAdmin,
}) {
  const [processando, setProcessando] = useState(false);
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState("");
  const [feito, setFeito] = useState("");
  const fileRef = useRef(null);

  const chaveProducao = (pedido, data, equipamento) =>
    `${String(pedido).trim()}|${String(data).trim()}|${String(equipamento).trim().toLowerCase()}`;
  const chaveCliente = (pedido, nome) => `${String(pedido).trim()}|${String(nome).trim().toLowerCase()}`;
  const chaveFinanceiroPagar = (descricao, vencimento) => `${String(descricao).trim().toLowerCase()}|${String(vencimento).trim()}`;

  const processarArquivo = async (file) => {
    setProcessando(true);
    setErro("");
    setPreview(null);
    setFeito("");
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array", cellDates: true });
      const acharPlanilha = (palavraChave) => wb.SheetNames.find((n) => normalizarCabecalho(n).includes(palavraChave));

      const paraData = (v) => {
        if (!v) return "";
        if (v instanceof Date) return v.toISOString().slice(0, 10);
        if (typeof v === "number") {
          const c = XLSX.SSF.parse_date_code(v);
          if (c) return `${c.y}-${String(c.m).padStart(2, "0")}-${String(c.d).padStart(2, "0")}`;
        }
        return dataOrdenavel(v);
      };

      // --- Produção Escavadeira / Perfuratriz (status + vendedor) ---
      const lerStatusProducao = (nomePlanilha) => {
        const mapa = new Map();
        if (!nomePlanilha) return mapa;
        const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomePlanilha], { header: 1, raw: true });
        const cab = detectarCabecalho(matriz, ["N DO PEDIDO", "N PEDIDO", "PEDIDO"]);
        if (!cab) return mapa;
        for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
          const linha = matriz[r] || [];
          const pedido = pegar(linha, cab.mapa, "N DO PEDIDO", "N PEDIDO", "PEDIDO");
          const data = paraData(pegar(linha, cab.mapa, "DATA"));
          const equipamento = pegar(linha, cab.mapa, "EQUIPAMENTO");
          const status = String(pegar(linha, cab.mapa, "STATUS", "PAGO")).trim().toUpperCase();
          const vendedor = String(pegar(linha, cab.mapa, "VENDEDOR")).trim();
          if (!pedido || !data) continue;
          mapa.set(chaveProducao(pedido, data, equipamento), { status, vendedor });
        }
        return mapa;
      };
      const nomeEsc = acharPlanilha("PRODUCAO ESCAVADEIRA") || acharPlanilha("ESCAVADEIRA");
      const nomePerf = acharPlanilha("PRODUCAO PERFURATRIZ") || acharPlanilha("PERFURATRIZ");
      const statusEscPlanilha = lerStatusProducao(nomeEsc);
      const statusPerfPlanilha = lerStatusProducao(nomePerf);

      const compararProducao = (lista, mapaPlanilha) => {
        const mudancas = [];
        lista.forEach((r) => {
          const info = mapaPlanilha.get(chaveProducao(r.pedido, r.data, r.equipamento));
          if (!info) return;
          const statusAtual = String(r.status || "").trim().toUpperCase();
          const vendedorAtual = String(r.vendedor || "").trim();
          const mudouStatus = !!info.status && info.status !== statusAtual;
          const mudouVendedor = !!info.vendedor && info.vendedor !== vendedorAtual;
          if (mudouStatus || mudouVendedor) {
            mudancas.push({
              id: r.id,
              pedido: r.pedido,
              data: r.data,
              equipamento: r.equipamento,
              cliente: r.cliente,
              statusAntigo: r.status,
              statusNovo: mudouStatus ? info.status : r.status,
              vendedorAntigo: r.vendedor,
              vendedorNovo: mudouVendedor ? info.vendedor : r.vendedor,
              mudouStatus,
              mudouVendedor,
            });
          }
        });
        return mudancas;
      };
      const mudancasEsc = compararProducao(producaoEsc, statusEscPlanilha);
      const mudancasPerf = compararProducao(producaoPerf, statusPerfPlanilha);

      // --- Clientes (status) ---
      // A planilha tem duas colunas separadas — "EMPRESA" e "CLIENTE" — e
      // qualquer uma pode estar vazia ou com o valor errado dependendo do
      // pedido. Por isso guarda os dois jeitos de bater (por empresa e por
      // nome) e tenta os dois lados no app também.
      const nomeClientesPlanilha = acharPlanilha("CLIENTES");
      const statusClientesPorEmpresa = new Map();
      const statusClientesPorNome = new Map();
      if (nomeClientesPlanilha) {
        const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomeClientesPlanilha], { header: 1, raw: true });
        const cab = detectarCabecalho(matriz, ["N DO PEDIDO", "N PEDIDO", "PEDIDO"]);
        if (cab) {
          for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
            const linha = matriz[r] || [];
            const pedido = pegar(linha, cab.mapa, "N DO PEDIDO", "N PEDIDO", "PEDIDO");
            const empresaPlanilha = pegar(linha, cab.mapa, "EMPRESA");
            const nomePlanilha = pegar(linha, cab.mapa, "CLIENTE", "NOME", "CONTATO");
            const status = normalizarStatusCliente(pegar(linha, cab.mapa, "STATUS"));
            if (!pedido || !status) continue;
            if (empresaPlanilha) statusClientesPorEmpresa.set(chaveCliente(pedido, empresaPlanilha), status);
            if (nomePlanilha) statusClientesPorNome.set(chaveCliente(pedido, nomePlanilha), status);
          }
        }
      }
      const mudancasClientes = [];
      clientes.forEach((c) => {
        const statusNovo =
          (c.empresa && statusClientesPorEmpresa.get(chaveCliente(c.pedido, c.empresa))) ||
          statusClientesPorNome.get(chaveCliente(c.pedido, c.nome)) ||
          statusClientesPorEmpresa.get(chaveCliente(c.pedido, c.nome));
        if (statusNovo && statusNovo !== String(c.status || "").trim()) {
          mudancasClientes.push({ id: c.id, pedido: c.pedido, nome: c.nome, statusAntigo: c.status, statusNovo });
        }
      });

      // --- Financeiro · Contas a Pagar (via aba Fluxo de Caixa) ---
      const nomeFluxo = acharPlanilha("FLUXO DE CAIXA");
      const statusPagarPlanilha = new Map();
      if (nomeFluxo) {
        const matriz = XLSX.utils.sheet_to_json(wb.Sheets[nomeFluxo], { header: 1, raw: true });
        const cab = detectarCabecalho(matriz, ["DESCRICAO"]);
        if (cab) {
          for (let r = cab.linhaIdx + 1; r < matriz.length; r++) {
            const linha = matriz[r] || [];
            const tipo = String(pegar(linha, cab.mapa, "TIPO")).trim().toUpperCase();
            if (tipo !== "SAIDA") continue;
            const descricao = pegar(linha, cab.mapa, "DESCRICAO");
            const vencimento = paraData(pegar(linha, cab.mapa, "DATA DE VENCIMENTO"));
            const situacao = String(pegar(linha, cab.mapa, "SITUACAO")).trim().toUpperCase();
            const statusApp = STATUS_FINANCEIRO_PLANILHA[situacao];
            if (!descricao || !vencimento || !statusApp) continue;
            statusPagarPlanilha.set(chaveFinanceiroPagar(descricao, vencimento), statusApp);
          }
        }
      }
      const mudancasFinanceiroPagar = [];
      (financeiro || []).forEach((c) => {
        if (c.tipo !== "Pagar") return;
        const statusNovo = statusPagarPlanilha.get(chaveFinanceiroPagar(c.descricao, c.vencimento));
        if (statusNovo && statusNovo !== String(c.status || "").trim()) {
          mudancasFinanceiroPagar.push({ id: c.id, descricao: c.descricao, vencimento: c.vencimento, statusAntigo: c.status, statusNovo });
        }
      });

      if (
        statusEscPlanilha.size === 0 &&
        statusPerfPlanilha.size === 0 &&
        statusClientesPorEmpresa.size === 0 &&
        statusClientesPorNome.size === 0 &&
        statusPagarPlanilha.size === 0
      ) {
        setErro("Não encontrei nenhuma área reconhecível nessa planilha (Produção, Clientes ou Fluxo de Caixa). Confirme que é a planilha certa.");
        setProcessando(false);
        return;
      }

      setPreview({ mudancasEsc, mudancasPerf, mudancasClientes, mudancasFinanceiroPagar, nomeArquivo: file.name });
    } catch (e) {
      setErro("Não consegui ler esse arquivo. Confirme que é uma planilha Excel (.xlsx, .xlsm) no formato original do sistema.");
    }
    setProcessando(false);
  };

  const confirmar = () => {
    if (!preview) return;
    const total = preview.mudancasEsc.length + preview.mudancasPerf.length + preview.mudancasClientes.length + preview.mudancasFinanceiroPagar.length;
    if (total === 0) return;
    requireAdmin(async () => {
      setProcessando(true);
      if (preview.mudancasEsc.length > 0) {
        const porId = new Map(preview.mudancasEsc.map((m) => [m.id, m]));
        await onChangeProducaoEsc(producaoEsc.map((r) => (porId.has(r.id) ? { ...r, status: porId.get(r.id).statusNovo, vendedor: porId.get(r.id).vendedorNovo } : r)));
      }
      if (preview.mudancasPerf.length > 0) {
        const porId = new Map(preview.mudancasPerf.map((m) => [m.id, m]));
        await onChangeProducaoPerf(producaoPerf.map((r) => (porId.has(r.id) ? { ...r, status: porId.get(r.id).statusNovo, vendedor: porId.get(r.id).vendedorNovo } : r)));
      }
      if (preview.mudancasClientes.length > 0) {
        const porId = new Map(preview.mudancasClientes.map((m) => [m.id, m.statusNovo]));
        await onChangeClientes(clientes.map((c) => (porId.has(c.id) ? { ...c, status: porId.get(c.id) } : c)));
      }
      if (preview.mudancasFinanceiroPagar.length > 0) {
        const porId = new Map(preview.mudancasFinanceiroPagar.map((m) => [m.id, m.statusNovo]));
        await onChangeFinanceiro(financeiro.map((c) => (porId.has(c.id) ? { ...c, status: porId.get(c.id) } : c)));
      }
      await registrarLog("Sincronização com planilha", `${total} registro(s) corrigido(s) a partir de ${preview.nomeArquivo}`);
      setFeito(`✓ ${total} registro(s) corrigido(s). O Financeiro (Contas a Receber) já se ajusta sozinho a partir da Produção.`);
      setPreview(null);
      setProcessando(false);
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  const totalMudancas = preview
    ? preview.mudancasEsc.length + preview.mudancasPerf.length + preview.mudancasClientes.length + preview.mudancasFinanceiroPagar.length
    : 0;

  const GRUPOS = preview
    ? [
        { titulo: "Produção Concreto", itens: preview.mudancasEsc, render: (m) => `Pedido #${m.pedido} · ${fmtDate(m.data)} · ${m.equipamento} · ${m.cliente}` },
        { titulo: "Clientes", itens: preview.mudancasClientes, render: (m) => `Pedido #${m.pedido} · ${m.nome}` },
        { titulo: "Financeiro · Contas a Pagar", itens: preview.mudancasFinanceiroPagar, render: (m) => `${m.descricao} · vence ${fmtDate(m.vencimento)}` },
      ].filter((g) => g.itens.length > 0)
    : [];

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <RefreshCw size={18} style={{ color: "var(--amber)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Sincronizar com a planilha</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Envia a planilha original e o sistema compara, ao mesmo tempo: status e vendedor da Produção, status dos Clientes, e status do Financeiro · Contas a Pagar (aba Fluxo de Caixa). Só corrige o que estiver diferente — nada é apagado nem duplicado. Corrigir a Produção já ajusta o Financeiro · Contas a Receber e o ranking de Vendedores sozinho.
      </p>

      <input ref={fileRef} type="file" accept=".xlsx,.xlsm,.xls" onChange={(e) => e.target.files[0] && processarArquivo(e.target.files[0])} disabled={processando} style={{ marginBottom: "16px" }} />

      {processando && <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Lendo planilha...</p>}
      {erro && <p style={{ fontSize: "12.5px", color: "var(--danger)", marginBottom: "12px" }}>{erro}</p>}

      {preview && (
        <div>
          {totalMudancas === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Nenhuma diferença encontrada — tudo já está batendo com a planilha.</p>
          ) : (
            <>
              <p style={{ fontSize: "13px", marginBottom: "10px" }}>
                <strong>{totalMudancas}</strong> registro(s) com diferença em relação à planilha:
              </p>
              {GRUPOS.map((g) => (
                <div key={g.titulo} style={{ marginBottom: "14px" }}>
                  <div className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                    {g.titulo} ({g.itens.length})
                  </div>
                  <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid var(--border-soft)", borderRadius: "6px" }}>
                    {g.itens.slice(0, 200).map((m) => (
                      <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", fontSize: "12.5px", borderBottom: "1px solid var(--border-soft)" }}>
                        <div>{g.render(m)}</div>
                        <div className="tl-mono" style={{ textAlign: "right" }}>
                          {"mudouStatus" in m ? (
                            <>
                              {m.mudouStatus && (
                                <div>
                                  <span style={{ color: "var(--text-faint)" }}>{m.statusAntigo || "-"}</span>
                                  {" → "}
                                  <strong style={{ color: "var(--success)" }}>{m.statusNovo}</strong>
                                </div>
                              )}
                              {m.mudouVendedor && (
                                <div style={{ fontSize: "11.5px" }}>
                                  <span style={{ color: "var(--text-faint)" }}>{m.vendedorAntigo || "(sem vendedor)"}</span>
                                  {" → "}
                                  <strong style={{ color: "var(--accent)" }}>{m.vendedorNovo}</strong>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <span style={{ color: "var(--text-faint)" }}>{m.statusAntigo || "-"}</span>
                              {" → "}
                              <strong style={{ color: "var(--success)" }}>{m.statusNovo}</strong>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {g.itens.length > 200 && (
                      <div style={{ padding: "8px 12px", fontSize: "12px", color: "var(--text-faint)" }}>e mais {g.itens.length - 200}...</div>
                    )}
                  </div>
                </div>
              ))}
              <Button onClick={confirmar} disabled={processando}>
                Corrigir esses {totalMudancas} registro(s)
              </Button>
            </>
          )}
        </div>
      )}

      {feito && <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "10px" }}>{feito}</p>}
    </div>
  );
}


function UsuariosManager({ usuarios, onChange }) {
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoAdmin, setNovoAdmin] = useState(false);
  const [novoPapel, setNovoPapel] = useState("Operacional");
  const [erro, setErro] = useState("");

  const adicionar = async (e) => {
    e.preventDefault();
    setErro("");
    if (!novoNome.trim()) return;
    if (usuarios.some((u) => u.nome.toLowerCase() === novoNome.trim().toLowerCase())) {
      setErro("Já existe um usuário com esse nome.");
      return;
    }
    if (novaSenha.length < 4) {
      setErro("Use pelo menos 4 caracteres na senha.");
      return;
    }
    const hash = await hashPassword(novaSenha);
    onChange([...usuarios, { id: uid(), nome: novoNome.trim(), senhaHash: hash, admin: novoAdmin, papel: novoAdmin ? "Administrador" : novoPapel, ativo: true, tourVisto: false }]);
    setNovoNome("");
    setNovaSenha("");
    setNovoAdmin(false);
    setNovoPapel("Operacional");
  };

  const remover = (id) => {
    onChange(usuarios.filter((u) => u.id !== id));
  };

  const alternarAdmin = (id) => {
    onChange(usuarios.map((u) => (u.id === id ? { ...u, admin: !u.admin, papel: !u.admin ? "Administrador" : (u.papel === "Administrador" ? "Operacional" : u.papel) } : u)));
  };

  const mudarPapel = (id, papel) => {
    onChange(usuarios.map((u) => (u.id === id ? { ...u, papel } : u)));
  };

  return (
    <div>
      <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginBottom: "10px" }}>
        Administrador vê tudo. Os outros papéis só veem as abas do próprio setor — <b>Financeiro</b> (financeiro, despesas, relatórios), <b>Comercial</b> (clientes, propostas, agenda) e <b>Operacional</b> (agenda, bombas, manutenção, ordens de serviço).
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
        {usuarios.length === 0 && <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nenhum usuário cadastrado ainda.</p>}
        {usuarios.map((u) => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "5px", padding: "8px 12px", fontSize: "13px", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ flex: 1, minWidth: "100px" }}>{u.nome}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!u.admin && (
                <Select value={u.papel || "Operacional"} onChange={(e) => mudarPapel(u.id, e.target.value)} style={{ fontSize: "11.5px", padding: "3px 8px", height: "auto" }}>
                  {PAPEIS_USUARIO.filter((p) => p !== "Administrador").map((p) => <option key={p}>{p}</option>)}
                </Select>
              )}
              <button
                type="button"
                onClick={() => alternarAdmin(u.id)}
                className="tl-focus"
                style={{
                  fontSize: "10.5px",
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  background: u.admin ? "var(--rust)" : "var(--bg-panel-raised)",
                  color: u.admin ? "#fff" : "var(--text-muted)",
                }}
              >
                {u.admin ? "ADMINISTRADOR" : "TORNAR ADMIN"}
              </button>
              <button type="button" onClick={() => remover(u.id)} className="tl-focus" style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "2px" }}>
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={adicionar} style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome da pessoa" style={{ flex: 1, minWidth: "140px" }} />
        <Input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Senha" style={{ width: "140px" }} />
        {!novoAdmin && (
          <Select value={novoPapel} onChange={(e) => setNovoPapel(e.target.value)} style={{ width: "130px" }}>
            {PAPEIS_USUARIO.filter((p) => p !== "Administrador").map((p) => <option key={p}>{p}</option>)}
          </Select>
        )}
        <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12.5px", color: "var(--text-muted)" }}>
          <input type="checkbox" checked={novoAdmin} onChange={(e) => setNovoAdmin(e.target.checked)} />
          Administrador
        </label>
        <Button type="submit" size="sm" variant="subtle" icon={Plus}>Adicionar</Button>
      </form>
      {erro && <p style={{ fontSize: "12px", color: "var(--danger)", marginTop: "8px" }}>{erro}</p>}
    </div>
  );
}

function LogAcessoLista({ logAcessos }) {
  const [verDados, setVerDados] = useState(null); // log selecionado, pra ver o que foi excluído
  const ordenado = [...(logAcessos || [])].sort((a, b) => (b.dataHora || "").localeCompare(a.dataHora || "")).slice(0, 50);
  if (ordenado.length === 0) {
    return <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nenhum acesso registrado ainda.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "320px", overflowY: "auto" }}>
      {ordenado.map((l) => {
        const dt = new Date(l.dataHora);
        const dataFmt = isNaN(dt.getTime()) ? "-" : dt.toLocaleString("pt-BR");
        return (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px", padding: "7px 10px", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "5px" }}>
            <div>
              <span style={{ fontWeight: 600 }}>{l.usuario}</span>
              <span style={{ color: "var(--text-faint)" }}> · {l.tipo === "Login" ? "entrou no sistema" : `excluiu ${l.detalhe}`}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {l.dadosExcluidos && (
                <button
                  onClick={() => setVerDados(l)}
                  className="tl-focus"
                  style={{ background: "none", border: "1px solid var(--border-soft)", borderRadius: "4px", padding: "2px 7px", fontSize: "11px", color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Ver dados
                </button>
              )}
              <span className="tl-mono" style={{ color: "var(--text-faint)", fontSize: "11px" }}>{dataFmt}</span>
            </div>
          </div>
        );
      })}
      {verDados && (
        <Modal title={`O que foi excluído — ${verDados.detalhe}`} onClose={() => setVerDados(null)}>
          <p style={{ fontSize: "12px", color: "var(--text-faint)", marginBottom: "14px" }}>
            Excluído por <strong>{verDados.usuario}</strong> em {new Date(verDados.dataHora).toLocaleString("pt-BR")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--border-soft)", borderRadius: "6px", overflow: "hidden" }}>
            {Object.entries(verDados.dadosExcluidos)
              .filter(([campo, valor]) => valor !== "" && valor !== null && valor !== undefined && !Array.isArray(valor) && campo !== "id")
              .map(([campo, valor]) => (
                <div key={campo} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "7px 10px", background: "var(--bg-base)", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-faint)", textTransform: "capitalize" }}>{campo}</span>
                  <span style={{ fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{String(valor)}</span>
                </div>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function OperadoresManager({ itens, onChange }) {
  const [novoNome, setNovoNome] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");

  const adicionar = (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    onChange([...itens, { id: uid(), nome: novoNome.trim(), telefone: novoTelefone.trim() }]);
    setNovoNome("");
    setNovoTelefone("");
  };

  const remover = (id) => onChange(itens.filter((i) => i.id !== id));
  const atualizarTelefone = (id, telefone) => onChange(itens.map((i) => (i.id === id ? { ...i, telefone } : i)));

  return (
    <div>
      <div className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
        Operadores <span style={{ textTransform: "none", color: "var(--text-faint)" }}>(com WhatsApp, pra Ordem de Serviço)</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px", maxHeight: "220px", overflowY: "auto" }}>
        {itens.length === 0 && <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nenhum cadastrado ainda.</p>}
        {porNome(itens).map((i) => (
          <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "5px", padding: "6px 10px", fontSize: "13px" }}>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.nome}</span>
            <Input
              value={i.telefone || ""}
              onChange={(e) => atualizarTelefone(i.id, formatarTelefone(e.target.value))}
              placeholder="(00) 00000-0000"
              style={{ width: "150px", fontSize: "12px", padding: "5px 8px" }}
            />
            <button type="button" onClick={() => remover(i.id)} className="tl-focus" style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "2px", flexShrink: 0 }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={adicionar} style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex: Cícero" style={{ flex: "1 1 140px", minWidth: "140px" }} />
        <Input value={novoTelefone} onChange={(e) => setNovoTelefone(formatarTelefone(e.target.value))} placeholder="WhatsApp" style={{ flex: "1 1 130px", minWidth: "130px" }} />
        <Button type="submit" size="sm" variant="subtle" icon={Plus} style={{ flexShrink: 0 }}>Add</Button>
      </form>
    </div>
  );
}

// Cadastro de vendedores com percentual de comissão — usado pra calcular
// sozinho a comissão de cada um sobre as propostas fechadas.
function VendedoresComComissao({ vendedores, onChange }) {
  const [novoNome, setNovoNome] = useState("");
  const [novaComissao, setNovaComissao] = useState("");

  const adicionar = (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    onChange([...vendedores, { id: uid(), nome: novoNome.trim(), comissaoPercentual: novaComissao || "0" }]);
    setNovoNome("");
    setNovaComissao("");
  };
  const remover = (id) => onChange(vendedores.filter((v) => v.id !== id));
  const mudarComissao = (id, valor) => onChange(vendedores.map((v) => (v.id === id ? { ...v, comissaoPercentual: valor } : v)));

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px" }}>
      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>Vendedores</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
        {vendedores.length === 0 && <p style={{ fontSize: "12px", color: "var(--text-faint)" }}>Nenhum vendedor cadastrado ainda.</p>}
        {vendedores.map((v) => (
          <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "5px", padding: "7px 10px", fontSize: "12.5px" }}>
            <span>{v.nome}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Input type="number" min="0" max="100" step="0.5" value={v.comissaoPercentual || ""} onChange={(e) => mudarComissao(v.id, e.target.value)} style={{ width: "60px", padding: "3px 6px", fontSize: "11.5px" }} />
              <span style={{ color: "var(--text-faint)", fontSize: "11px" }}>% comissão</span>
              <button type="button" onClick={() => remover(v.id)} className="tl-focus" style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "2px" }}>
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={adicionar} style={{ display: "flex", gap: "6px" }}>
        <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome" style={{ flex: 1 }} />
        <Input type="number" min="0" max="100" step="0.5" value={novaComissao} onChange={(e) => setNovaComissao(e.target.value)} placeholder="%" style={{ width: "60px" }} />
        <Button type="submit" size="sm" variant="subtle" icon={Plus}>Add</Button>
      </form>
    </div>
  );
}

function CadastroSimples({ titulo, itens, onChange, comTipo, placeholder }) {
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState("Betoneira Estacionária");

  const adicionar = (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    const item = comTipo ? { id: uid(), nome: novoNome.trim(), tipo: novoTipo } : { id: uid(), nome: novoNome.trim() };
    onChange([...itens, item]);
    setNovoNome("");
  };

  const remover = (id) => {
    onChange(itens.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>{titulo}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px", maxHeight: "180px", overflowY: "auto" }}>
        {itens.length === 0 && <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nenhum cadastrado ainda.</p>}
        {porNome(itens).map((i) => (
          <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "5px", padding: "6px 10px", fontSize: "13px" }}>
            <span>{i.nome}{comTipo && i.tipo ? <span style={{ color: "var(--text-faint)" }}> · {i.tipo}</span> : null}</span>
            <button type="button" onClick={() => remover(i.id)} className="tl-focus" style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "2px" }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={adicionar} style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder={placeholder || "Nome"} style={{ flex: "1 1 140px", minWidth: "140px" }} />
        {comTipo && (
          <Select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)} style={{ flex: "1 1 130px", minWidth: "130px" }}>
            <option>Betoneira Estacionária</option>
            <option>Caminhão Betoneira</option>
            <option>Outro</option>
          </Select>
        )}
        <Button type="submit" size="sm" variant="subtle" icon={Plus} style={{ flexShrink: 0 }}>Add</Button>
      </form>
    </div>
  );
}

function PasswordField({ icon: Icon, title, description, onSave }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (pw.length < 4) {
      setError("Use pelo menos 4 caracteres.");
      return;
    }
    if (pw !== pw2) {
      setError("As senhas não coincidem.");
      return;
    }
    setSaving(true);
    const hash = await hashPassword(pw);
    await onSave(hash);
    setSaving(false);
    setSaved(true);
    setPw("");
    setPw2("");
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", maxWidth: "420px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Icon size={18} style={{ color: "var(--amber)" }} />
        <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>{title}</h3>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "18px", lineHeight: 1.5 }}>
        {description}
      </p>

      <form onSubmit={handleSubmit}>
        <Field label="Nova senha">
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        </Field>
        <Field label="Confirmar nova senha">
          <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
        </Field>

        {error && (
          <p style={{ fontSize: "12.5px", color: "var(--danger)", marginTop: "-8px", marginBottom: "14px" }}>{error}</p>
        )}
        {saved && (
          <p style={{ fontSize: "12.5px", color: "var(--success)", marginTop: "-8px", marginBottom: "14px" }}>Senha alterada com sucesso.</p>
        )}

        <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar nova senha"}</Button>
      </form>
    </div>
  );
}

// Dados da empresa (nome, CNPJ, endereço) — usados nos PDFs gerados pelo
// sistema (proposta, relatório, recibo, etc). Ficam em branco por padrão,
// pra qualquer cópia nova do sistema nascer sem dado de empresa nenhuma
// fixo no código — cada cliente preenche o dele aqui.
// Redimensiona e converte a imagem escolhida pra PNG base64 — usado tanto
// no menu lateral quanto no cabeçalho dos PDFs, então mantém transparência.
function converterLogoParaPng(file, maxDim = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Falha ao carregar imagem"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function DadosEmpresaSection({ prefs, onPrefsChanged }) {
  const [nome, setNome] = useState(prefs.nomeEmpresa || "");
  const [cnpj, setCnpj] = useState(prefs.cnpjEmpresa || "");
  const [endereco, setEndereco] = useState(prefs.enderecoEmpresa || "");
  const [salvo, setSalvo] = useState(false);
  const [enviandoLogo, setEnviandoLogo] = useState(false);
  const fileRef = React.useRef(null);

  const salvar = (e) => {
    e.preventDefault();
    onPrefsChanged({ ...prefs, nomeEmpresa: nome.trim(), cnpjEmpresa: cnpj.trim(), enderecoEmpresa: endereco.trim() });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const enviarLogo = async (file) => {
    if (!file) return;
    setEnviandoLogo(true);
    try {
      const pngDataUrl = await converterLogoParaPng(file);
      // Mesmo arquivo serve pro menu lateral e pro cabeçalho dos PDFs.
      onPrefsChanged({ ...prefs, logoPersonalizado: pngDataUrl, logoPngPersonalizado: pngDataUrl });
    } catch (e) {
      console.error("Falha ao processar logo", e);
    }
    setEnviandoLogo(false);
  };

  const removerLogo = () => {
    onPrefsChanged({ ...prefs, logoPersonalizado: "", logoPngPersonalizado: "" });
  };

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
      <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>Dados da empresa</h3>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px", maxWidth: "560px" }}>
        Aparecem no menu lateral e no cabeçalho de todo PDF gerado pelo sistema (propostas, recibos, relatórios, etc).
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "9px", border: "1px solid var(--border-soft)", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {prefs.logoPersonalizado ? (
            <img src={prefs.logoPersonalizado} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <Truck size={26} style={{ color: "var(--text-faint)" }} />
          )}
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && enviarLogo(e.target.files[0])} />
          <div style={{ display: "flex", gap: "8px" }}>
            <Button type="button" variant="subtle" size="sm" icon={Upload} disabled={enviandoLogo} onClick={() => fileRef.current?.click()}>
              {enviandoLogo ? "Enviando..." : prefs.logoPersonalizado ? "Trocar foto" : "Enviar foto da logo"}
            </Button>
            {prefs.logoPersonalizado && (
              <Button type="button" variant="ghost" size="sm" icon={Trash2} onClick={removerLogo}>Remover</Button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={salvar}>
        <Field label="Nome da empresa">
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Locadora Silva Ltda" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 16px" }}>
          <Field label="CNPJ">
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
          </Field>
          <Field label="Endereço">
            <Input value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, bairro, cidade - UF" />
          </Field>
        </div>
        <Button type="submit">{salvo ? "Salvo!" : "Salvar dados da empresa"}</Button>
      </form>
    </div>
  );
}

function ConfiguracoesModule({ onPasswordChanged, onAppPasswordChanged, prefs, onPrefsChanged, maquinas, onChangeMaquinas, operadores, onChangeOperadores, vendedores, onChangeVendedores, usuarios, onChangeUsuarios, logAcessos, clientes, onChangeClientes, producaoEsc, onChangeProducaoEsc, producaoPerf, onChangeProducaoPerf, statusClientes, onChangeStatusClientes, financeiro, onChangeFinanceiro, manutencoes, onChangeManutencoes, agenda, onChangeAgenda, funcionarios, onChangeFuncionarios, motoristas, onChangeMotoristas, caminhoes, onChangeCaminhoes, empresasRetirada, onChangeEmpresasRetirada, requireAdmin }) {
  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Administração" title="Configurações" />

      <DadosEmpresaSection prefs={prefs} onPrefsChanged={onPrefsChanged} />

      <BackupSection />
      <RestaurarBackupSection
        onChangeClientes={onChangeClientes}
        onChangeProducaoEsc={onChangeProducaoEsc}
        onChangeProducaoPerf={onChangeProducaoPerf}
        onChangeFinanceiro={onChangeFinanceiro}
        onChangeManutencoes={onChangeManutencoes}
        onChangeAgenda={onChangeAgenda}
        onChangeMaquinas={onChangeMaquinas}
        onChangeOperadores={onChangeOperadores}
        onChangeVendedores={onChangeVendedores}
        onChangeStatusClientes={onChangeStatusClientes}
        onChangeFuncionarios={onChangeFuncionarios}
        onChangeMotoristas={onChangeMotoristas}
        onChangeCaminhoes={onChangeCaminhoes}
        onChangeEmpresasRetirada={onChangeEmpresasRetirada}
        requireAdmin={requireAdmin}
      />

      <RevisarPagamentosSection
        producaoEsc={producaoEsc}
        producaoPerf={producaoPerf}
        onChangeProducaoEsc={onChangeProducaoEsc}
        onChangeProducaoPerf={onChangeProducaoPerf}
      />

      <SincronizarPlanilhaSection
        clientes={clientes}
        producaoEsc={producaoEsc}
        producaoPerf={producaoPerf}
        financeiro={financeiro}
        onChangeClientes={onChangeClientes}
        onChangeProducaoEsc={onChangeProducaoEsc}
        onChangeProducaoPerf={onChangeProducaoPerf}
        onChangeFinanceiro={onChangeFinanceiro}
        requireAdmin={requireAdmin}
      />

      <ImportarDadosSection
        clientes={clientes}
        producaoEsc={producaoEsc}
        producaoPerf={producaoPerf}
        financeiro={financeiro}
        manutencoes={manutencoes}
        agenda={agenda}
        maquinas={maquinas}
        onImportarClientes={onChangeClientes}
        onImportarProducaoEsc={onChangeProducaoEsc}
        onImportarProducaoPerf={onChangeProducaoPerf}
        onImportarFinanceiro={onChangeFinanceiro}
        onImportarManutencoes={onChangeManutencoes}
        onImportarAgenda={onChangeAgenda}
      />

      <CorrigirClientesDuplicadosSection clientes={clientes} onChangeClientes={onChangeClientes} />

      <ZerarFinanceiroSection financeiro={financeiro} onChangeFinanceiro={onChangeFinanceiro} />

      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Users size={18} style={{ color: "var(--amber)" }} />
          <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Usuários</h3>
        </div>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Cada pessoa entra com o próprio nome e senha. Só quem for marcado como <strong>administrador</strong> acessa Clientes, Produção, Configurações e pode excluir itens.
        </p>
        <UsuariosManager usuarios={usuarios} onChange={onChangeUsuarios} />
      </div>

      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <ClipboardCheck size={18} style={{ color: "var(--amber)" }} />
          <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Histórico de acesso</h3>
        </div>
        <LogAcessoLista logAcessos={logAcessos} />
      </div>

      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Wrench size={18} style={{ color: "var(--amber)" }} />
          <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Cadastros</h3>
        </div>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Essas listas alimentam as opções em Produção, Manutenção e outras abas do sistema.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <VendedoresComComissao vendedores={vendedores} onChange={onChangeVendedores} />
          <CadastroSimples titulo="Status de clientes" itens={statusClientes} onChange={onChangeStatusClientes} placeholder="Ex: Em negociação" />
          <CadastroSimples titulo="Funcionários" itens={funcionarios} onChange={onChangeFuncionarios} placeholder="Ex: João da Silva" />
          <CadastroSimples titulo="Motoristas" itens={motoristas} onChange={onChangeMotoristas} placeholder="Ex: Carlos" />
          <CadastroSimples titulo="Caminhões" itens={caminhoes} onChange={onChangeCaminhoes} placeholder="Ex: ABC-1234" />
        </div>
      </div>

      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "20px", maxWidth: "420px", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Settings size={18} style={{ color: "var(--amber)" }} />
          <h3 className="tl-display" style={{ fontSize: "18px", fontWeight: 700 }}>Aparência</h3>
        </div>

        <Field label="Tema">
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant={prefs.theme !== "light" ? "primary" : "subtle"}
              onClick={() => onPrefsChanged({ ...prefs, theme: "dark" })}
              type="button"
            >
              Escuro
            </Button>
            <Button
              variant={prefs.theme === "light" ? "primary" : "subtle"}
              onClick={() => onPrefsChanged({ ...prefs, theme: "light" })}
              type="button"
            >
              Claro
            </Button>
          </div>
        </Field>

        <Field label="Tamanho da letra" hint={`${Math.round((prefs.fontScale || 1) * 100)}%`}>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="subtle"
              type="button"
              disabled={(prefs.fontScale || 1) <= 0.85}
              onClick={() => onPrefsChanged({ ...prefs, fontScale: Math.max(0.85, (prefs.fontScale || 1) - 0.1) })}
            >
              A-
            </Button>
            <Button
              variant="subtle"
              type="button"
              onClick={() => onPrefsChanged({ ...prefs, fontScale: 1 })}
            >
              Padrão
            </Button>
            <Button
              variant="subtle"
              type="button"
              disabled={(prefs.fontScale || 1) >= 1.3}
              onClick={() => onPrefsChanged({ ...prefs, fontScale: Math.min(1.3, (prefs.fontScale || 1) + 0.1) })}
            >
              A+
            </Button>
          </div>
        </Field>
        <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginTop: "4px" }}>
          Essas duas opções são seguras — só mudam a aparência, nunca os dados.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <PasswordField
          icon={Lock}
          title="Senha de acesso ao sistema"
          description="Pedida assim que o app é aberto, antes de qualquer tela. Sem ela, ninguém entra."
          onSave={onAppPasswordChanged}
        />
        <PasswordField
          icon={KeyRound}
          title="Senha de administrador"
          description="Protege as abas Clientes, Produção, Controle Diário e esta própria tela de Configurações."
          onSave={onPasswordChanged}
        />
      </div>

      <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginTop: "16px", maxWidth: "420px" }}>
        Lembrete: se o app estiver hospedado em mais de um lugar (por exemplo, aqui no Claude e também no site publicado), cada um guarda as senhas separadamente — trocar aqui não muda a do outro.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Relatório Geral módulo                                              */
/* ------------------------------------------------------------------ */
function RelatoriosModule({ clientes, producaoEsc, producaoPerf, propostas, manutencoes, ticks, controleDiario, agenda, maquinas, financeiro, goTo }) {
  const [subTab, setSubTab] = useState("resumo");
  const totalFaturadoEsc = producaoEsc.reduce((s, r) => s + (Number(r.total) || 0), 0);
  const totalFaturadoPerf = producaoPerf.reduce((s, r) => s + (Number(r.total) || 0), 0);
  const abertosEsc = producaoEsc.filter((r) => r.status === "EM ABERTO").length;
  const abertosPerf = producaoPerf.filter((r) => r.status === "EM ABERTO").length;
  const totalMetragem = producaoPerf.reduce((s, r) => s + (Number(r.metragem) || 0), 0);
  const totalPropostas = propostas.reduce(
    (s, p) => s + p.itens.reduce((si, it) => si + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0),
    0
  );
  const gastoManutencao = manutencoes.filter((m) => m.tipo === "Manutenção").reduce((s, m) => s + (Number(m.valor) || 0), 0);
  const gastoAbastecimento = manutencoes.filter((m) => m.tipo === "Abastecimento").reduce((s, m) => s + (Number(m.valor) || 0), 0);
  const horasTotais = controleDiario.reduce((s, r) => {
    const ini = Number(r.horimetroInicio), fim = Number(r.horimetroFim);
    return s + (!isNaN(ini) && !isNaN(fim) && fim >= ini ? fim - ini : 0);
  }, 0);
  const litrosTotais = controleDiario.reduce((s, r) => s + (r.abastecida ? Number(r.litros) || 0 : 0), 0);
  const hojeISO = new Date().toISOString().slice(0, 10);
  const compromissosPendentes = agenda.filter((a) => a.status !== "Concluído").length;

  // Lista todas as cargas que voltaram com sobra (qualquer pedido), mais
  // nova primeiro — mostra de qual obra a sobra veio (o próprio pedido da
  // carga) e, se foi preenchido na Central de Balança, pra qual obra ela
  // foi usada depois.
  const clienteDoPedidoRel = useMemo(() => {
    const mapa = new Map();
    clientes.forEach((c) => mapa.set(String(c.pedido).trim(), c));
    return mapa;
  }, [clientes]);
  const listaSobras = useMemo(() => {
    const linhas = [];
    producaoEsc.forEach((r) => {
      (r.viagens || []).forEach((v) => {
        if (numeroSeguro(v.sobra) <= 0) return;
        const clienteOrigem = clienteDoPedidoRel.get(String(r.pedido).trim());
        const clienteDestino = v.sobraDestinoPedido ? clienteDoPedidoRel.get(String(v.sobraDestinoPedido).trim()) : null;
        linhas.push({
          id: v.id,
          data: r.data,
          pedidoOrigem: r.pedido,
          clienteOrigem: clienteOrigem?.nome || r.cliente || "-",
          volumeCarga: numeroSeguro(v.volume),
          sobra: numeroSeguro(v.sobra),
          pedidoDestino: v.sobraDestinoPedido || "",
          clienteDestino: clienteDestino?.nome || "",
        });
      });
    });
    return linhas.sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data)));
  }, [producaoEsc, clienteDoPedidoRel]);
  const totalSobras = listaSobras.reduce((s, l) => s + l.sobra, 0);
  const sobrasReaproveitadas = listaSobras.filter((l) => l.pedidoDestino).length;

  const secoes = [
    {
      titulo: "Clientes",
      icon: Users,
      destino: "clientes",
      itens: [
        { label: "Total cadastrados", valor: clientes.length },
      ],
    },
    {
      titulo: "Produção-Concreto",
      icon: Truck,
      destino: "producaoEsc",
      itens: [
        { label: "Total de pedidos", valor: producaoEsc.length },
        { label: "Em aberto", valor: abertosEsc },
        { label: "Faturamento total", valor: money(totalFaturadoEsc) },
      ],
    },
    {
      titulo: "Propostas",
      icon: FileText,
      destino: "propostas",
      itens: [
        { label: "Total emitidas", valor: propostas.length },
        { label: "Valor total em propostas", valor: money(totalPropostas) },
      ],
    },
    {
      titulo: "Manutenção & Abastecimento",
      icon: Wrench,
      destino: "manutencao",
      itens: [
        { label: "Máquinas cadastradas", valor: maquinas.length },
        { label: "Gasto em manutenção", valor: money(gastoManutencao) },
        { label: "Gasto em abastecimento", valor: money(gastoAbastecimento) },
      ],
    },
    {
      titulo: "Controle Diário",
      icon: Gauge,
      destino: "controleDiario",
      itens: [
        { label: "Apontamentos registrados", valor: controleDiario.length },
        { label: "Horas trabalhadas (total)", valor: `${horasTotais}h` },
        { label: "Litros abastecidos (total)", valor: `${litrosTotais} L` },
      ],
    },
    {
      titulo: "Agenda",
      icon: Calendar,
      destino: "agenda",
      itens: [
        { label: "Compromissos pendentes", valor: compromissosPendentes },
      ],
    },
  ];

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow={`Atualizado em ${fmtDate(hojeISO)}`}
        title="Relatório Geral"
        action={<Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>}
      />

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "4px", flexWrap: "wrap" }}>
        {[
          { id: "resumo", label: "Resumo" },
          { id: "inadimplencia", label: "Inadimplência" },
          { id: "comparativo", label: "Comparativo mensal" },
          { id: "operadores", label: "Produtividade" },
          { id: "vendedores", label: "Vendedores" },
          { id: "sobras", label: "Sobras" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className="tl-focus"
            style={{
              flex: "1 1 auto",
              minWidth: "120px",
              padding: "8px 10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: subTab === t.id ? "var(--bg-panel-raised)" : "transparent",
              color: subTab === t.id ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "12.5px",
              fontWeight: subTab === t.id ? 600 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "inadimplencia" && <InadimplenciaSection clientes={clientes} financeiro={financeiro} producaoEsc={producaoEsc} producaoPerf={producaoPerf} propostas={propostas} />}
      {subTab === "comparativo" && <ComparativoMensalSection producaoEsc={producaoEsc} producaoPerf={producaoPerf} />}
      {subTab === "operadores" && <ProdutividadeOperadorSection producaoEsc={producaoEsc} producaoPerf={producaoPerf} />}
      {subTab === "vendedores" && <VendedoresSection producaoEsc={producaoEsc} producaoPerf={producaoPerf} />}
      {subTab === "sobras" && (
        <div className="tl-fade-in">
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <MiniStat label="Sobra total (m³)" valor={`${totalSobras.toFixed(1)} m³`} />
            <MiniStat label="Sobras reaproveitadas em outra obra" valor={`${sobrasReaproveitadas} de ${listaSobras.length}`} />
          </div>
          {listaSobras.length === 0 ? (
            <EmptyState icon={Truck} title="Nenhuma sobra registrada ainda" hint='Preenche "Sobra que voltou" numa carga, na Central de Balança, pra ela aparecer aqui.' />
          ) : (
            <Table
              columns={["Data", "Veio da obra (pedido)", "Volume da carga", "Sobra", "Foi usada na obra (pedido)"]}
              rows={listaSobras.map((l) => [
                fmtDate(l.data),
                `#${l.pedidoOrigem} — ${l.clienteOrigem}`,
                `${l.volumeCarga} m³`,
                <strong key="sobra">{l.sobra} m³</strong>,
                l.pedidoDestino ? `#${l.pedidoDestino}${l.clienteDestino ? ` — ${l.clienteDestino}` : ""}` : <span style={{ color: "var(--text-faint)" }}>Não informado</span>,
              ])}
            />
          )}
        </div>
      )}

      {subTab === "resumo" && (
      <div className="tl-print-area" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="tl-print-only-header" style={{ display: "none" }}>
          <h2>Relatório Geral — {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {secoes.map((sec) => (
            <button
              key={sec.titulo}
              onClick={() => goTo && goTo(sec.destino)}
              className="tl-focus"
              style={{ textAlign: "left", cursor: "pointer", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <sec.icon size={15} style={{ color: "var(--amber)" }} />
                  <h4 className="tl-mono" style={{ fontSize: "11.5px", letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                    {sec.titulo}
                  </h4>
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {sec.itens.map((it) => (
                  <div key={it.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-faint)" }}>{it.label}</span>
                    <span style={{ fontWeight: 600 }} className="tl-mono">{it.valor}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Financeiro módulo                                                   */
/* ------------------------------------------------------------------ */
function InadimplenciaSection({ clientes, financeiro, producaoEsc, producaoPerf, propostas }) {
  const hojeISO = new Date().toISOString().slice(0, 10);
  const [verCliente, setVerCliente] = useState(null); // nome do cliente selecionado
  const [filtro, setFiltro] = useState("todos"); // todos | atrasado | futuro
  const [gerandoPdfCliente, setGerandoPdfCliente] = useState(false);
  const [avisoPdfCliente, setAvisoPdfCliente] = useState("");

  const porCliente = useMemo(() => {
    const mapa = new Map();
    const registrar = (nomeCliente, valor, dataRef, atrasado, item) => {
      if (!nomeCliente) return;
      // Agrupa por nome "normalizado" (sem espaços extras, sem diferença
      // de maiúscula/minúscula) — assim, um lançamento de Escavadeira e um
      // de Perfuratriz do mesmo cliente não viram dois clientes diferentes
      // só porque o nome foi digitado com uma letra maiúscula a mais ou
      // um espaço a mais numa das telas.
      const chave = String(nomeCliente).trim().toLowerCase();
      if (!mapa.has(chave)) mapa.set(chave, { nome: String(nomeCliente).trim(), totalAberto: 0, totalAtrasado: 0, totalFuturo: 0, qtd: 0, maisAntiga: null, atrasado: false, itens: [] });
      const acc = mapa.get(chave);
      acc.totalAberto += valor;
      if (atrasado) {
        acc.totalAtrasado += valor;
        acc.atrasado = true;
      } else {
        acc.totalFuturo += valor;
      }
      acc.qtd += 1;
      if (!acc.maisAntiga || dataOrdenavel(dataRef) < dataOrdenavel(acc.maisAntiga)) acc.maisAntiga = dataRef;
      acc.itens.push(item);
    };

    (financeiro || [])
      // Contas com producaoId vêm AUTOMATICAMENTE de um lançamento de
      // Produção (é a mesma sincronização que já existe) — contar essas
      // aqui E o lançamento de Produção lá embaixo duplicava tudo, quase
      // dobrando a quantidade e o valor mostrados. Só entram aqui as
      // contas manuais, que não têm essa origem.
      .filter((c) => c.tipo === "Receber" && c.status !== "Pago" && c.status !== "Cancelado" && !c.producaoId)
      .forEach((c) => {
        const nome = clienteByPedidoNome(clientes, c.pedido) || c.fornecedor || c.descricao || "Cliente não identificado";
        const atrasado = c.vencimento && dataOrdenavel(c.vencimento) < hojeISO;
        registrar(nome, numeroSeguro(c.valor), c.vencimento, atrasado, {
          origem: "Financeiro",
          pedido: c.pedido || "-",
          descricao: c.descricao || "-",
          data: c.vencimento,
          valor: numeroSeguro(c.valor),
          atrasado,
        });
      });

    [...(producaoEsc || []), ...(producaoPerf || [])]
      // Só entra como pendência se a data do serviço já passou (ou é hoje)
      // — um lançamento com data futura é uma obra ainda não realizada,
      // não uma cobrança em aberto de verdade.
      .filter((r) => String(r.status || "").toUpperCase() !== "PAGO" && r.data && dataOrdenavel(r.data) <= hojeISO)
      .forEach((r) => {
        // Usa a mesma regra do Financeiro pra saber se já está atrasado:
        // prazo de pagamento = data do serviço + 30 dias. Sem isso, todo
        // lançamento de Produção (Escavadeira OU Perfuratriz) caía sempre
        // em "a vencer", mesmo quando já estava vencido há muito tempo.
        const vencimentoImplicito = adicionarDias(r.data, 30) || r.data;
        const atrasadoProducao = dataOrdenavel(vencimentoImplicito) < hojeISO;
        registrar(r.cliente || "Cliente não identificado", numeroSeguro(r.total), vencimentoImplicito, atrasadoProducao, {
          origem: "Produção",
          pedido: r.pedido || "-",
          descricao: `${r.equipamento || "-"} — ${r.status || "-"}`,
          data: r.data,
          valor: numeroSeguro(r.total),
          atrasado: atrasadoProducao,
        });
      });

    return [...mapa.values()].sort((a, b) => b.totalAtrasado - a.totalAtrasado || b.totalAberto - a.totalAberto);
  }, [clientes, financeiro, producaoEsc, producaoPerf, hojeISO]);

  const listaExibida =
    filtro === "atrasado" ? porCliente.filter((c) => c.atrasado) :
    filtro === "futuro" ? porCliente.filter((c) => c.totalFuturo > 0) :
    porCliente;
  const totalGeral = porCliente.reduce((s, c) => s + c.totalAberto, 0);
  const totalAtrasadoGeral = porCliente.reduce((s, c) => s + c.totalAtrasado, 0);
  const totalFuturoGeral = porCliente.reduce((s, c) => s + c.totalFuturo, 0);
  const clienteSelecionado = porCliente.find((c) => c.nome === verCliente);
  // Acha o cadastro de cliente de verdade (com telefone) a partir do nome
  // — o "clienteSelecionado" acima é só o resumo agregado, sem telefone.
  const cadastroClienteSelecionado = useMemo(() => {
    if (!clienteSelecionado) return null;
    const chave = clienteSelecionado.nome.trim().toLowerCase();
    return (clientes || []).find((c) => String(c.nome || "").trim().toLowerCase() === chave) || null;
  }, [clientes, clienteSelecionado]);

  const enviarRelatorioCliente = async (modo) => {
    if (!clienteSelecionado) return;
    setGerandoPdfCliente(true);
    setAvisoPdfCliente("");
    const blob = await gerarPdfInadimplenciaCliente(cadastroClienteSelecionado || { nome: clienteSelecionado.nome }, clienteSelecionado.itens, clienteSelecionado.totalAberto);
    setGerandoPdfCliente(false);

    const fileName = `pendencias-${clienteSelecionado.nome.replace(/\s+/g, "-").toLowerCase()}.pdf`;

    if (!blob) {
      setAvisoPdfCliente("Geração de PDF não disponível nesta pré-visualização — no site publicado, este botão gera o documento com a logo.");
      return;
    }

    if (modo === "imprimir") {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // modo === "whatsapp"
    const texto =
      `*Relatório de pendências — ${clienteSelecionado.nome}*\n\n` +
      `${clienteSelecionado.qtd} lançamento(s) em aberto\n` +
      `Total: ${money(clienteSelecionado.totalAberto)}\n\n${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;

    const file = new File([blob], fileName, { type: "application/pdf" });
    if (ehCelular && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Pendências - ${clienteSelecionado.nome}`, text: `Relatório de pendências - ${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}` });
        return;
      } catch (e) {
        /* segue pro download abaixo */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    let telefone = (cadastroClienteSelecionado?.telefone || "").replace(/\D/g, "");
    if (!telefone) {
      const digitado = window.prompt("Cliente sem telefone cadastrado. Digite o número (com DDD):", "");
      telefone = (digitado || "").replace(/\D/g, "");
    }
    if (telefone) {
      const numeroFinal = telefone.startsWith("55") ? telefone : `55${telefone}`;
      window.alert(`PDF baixado como "${fileName}" (confira a pasta Downloads).\n\nO WhatsApp vai abrir agora só com o texto — anexe esse arquivo baixado na conversa antes de enviar.`);
      window.open(`https://wa.me/${numeroFinal}?text=${encodeURIComponent(texto)}`, "_blank");
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        <MiniStat
          label="Clientes com pendência"
          valor={porCliente.length}
          ativo={filtro === "todos"}
          onClick={() => setFiltro("todos")}
        />
        <MiniStat
          label="Realmente atrasado"
          valor={money(totalAtrasadoGeral)}
          cor="var(--danger)"
          ativo={filtro === "atrasado"}
          onClick={() => setFiltro(filtro === "atrasado" ? "todos" : "atrasado")}
        />
        <MiniStat
          label="A vencer (futuro, em dia)"
          valor={money(totalFuturoGeral)}
          cor="var(--amber)"
          ativo={filtro === "futuro"}
          onClick={() => setFiltro(filtro === "futuro" ? "todos" : "futuro")}
        />
        <MiniStat
          label="Total em aberto (soma dos dois)"
          valor={money(totalGeral)}
          ativo={filtro === "todos"}
          onClick={() => setFiltro("todos")}
        />
      </div>
      <p style={{ fontSize: "12px", color: "var(--text-faint)", marginBottom: "16px" }}>
        Clica em qualquer cartão acima pra filtrar a lista por ele — ter algo "a vencer" não significa que o cliente está devendo, só que ainda não chegou a data.
      </p>
      {listaExibida.length === 0 ? (
        <EmptyState
          icon={Users}
          title={filtro === "atrasado" ? "Ninguém atrasado no momento" : filtro === "futuro" ? "Ninguém com pagamento a vencer" : "Nenhuma pendência"}
          hint={filtro === "atrasado" ? "Todos os clientes com saldo em aberto estão em dia." : filtro === "futuro" ? "Nenhum cliente com valor a vencer no momento." : "Nenhum cliente com conta ou produção em aberto no momento."}
        />
      ) : (
        <Table
          columns={["Cliente", "Lançamentos em aberto", "Mais antigo", "Atrasado", "A vencer", ""]}
          rows={listaExibida.map((c) => (
            <tr key={c.nome} style={rowStyle}>
              <td style={tdStyle}>
                <button onClick={() => setVerCliente(c.nome)} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500, textDecoration: "underline", textDecorationColor: "var(--border-soft)" }}>
                  {c.nome}
                </button>
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                <button onClick={() => setVerCliente(c.nome)} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontWeight: 700 }}>
                  {c.qtd}
                </button>
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(c.maisAntiga)}</td>
              <td style={{ ...tdStyle, fontWeight: 600, color: c.totalAtrasado > 0 ? "var(--danger)" : "var(--text-faint)" }} className="tl-mono">
                {c.totalAtrasado > 0 ? money(c.totalAtrasado) : "-"}
              </td>
              <td style={{ ...tdStyle, fontWeight: 600, color: c.totalFuturo > 0 ? "var(--amber)" : "var(--text-faint)" }} className="tl-mono">
                {c.totalFuturo > 0 ? money(c.totalFuturo) : "-"}
              </td>
              <td style={tdStyle}>{c.atrasado ? <StatusBadge status="ATRASADO" /> : <span style={{ fontSize: "11.5px", color: "var(--success)" }}>Em dia</span>}</td>
            </tr>
          ))}
        />
      )}

      {clienteSelecionado && (
        <Modal title={`Relatório de pendências — ${clienteSelecionado.nome}`} onClose={() => setVerCliente(null)}>
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", marginBottom: "14px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span>{clienteSelecionado.qtd} lançamento(s) em aberto</span>
            <strong className="tl-mono" style={{ color: "var(--amber)" }}>{money(clienteSelecionado.totalAberto)}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "16px" }}>
            {[...clienteSelecionado.itens]
              .sort((a, b) => dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data)))
              .map((it, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "13px" }}>
                  <div>
                    <strong>{i + 1}. Pedido #{it.pedido}</strong>
                    {it.atrasado && <span style={{ marginLeft: "6px" }}><StatusBadge status="ATRASADO" /></span>}
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      {fmtDate(it.data)} · {it.origem} · {it.descricao}
                    </div>
                  </div>
                  <strong className="tl-mono">{money(it.valor)}</strong>
                </div>
              ))}
          </div>

          {avisoPdfCliente && (
            <div style={{ background: "#3A2F13", border: "1px solid #5a4a20", color: "#E8A63D", borderRadius: "6px", padding: "10px 12px", fontSize: "12.5px", marginBottom: "14px" }}>
              {avisoPdfCliente}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="subtle" icon={Printer} disabled={gerandoPdfCliente} onClick={() => enviarRelatorioCliente("imprimir")} style={{ flex: 1, justifyContent: "center" }}>
              {gerandoPdfCliente ? "Gerando..." : "Baixar / Imprimir"}
            </Button>
            <Button icon={MessageCircle} disabled={gerandoPdfCliente} onClick={() => enviarRelatorioCliente("whatsapp")} style={{ flex: 1, justifyContent: "center" }}>
              {gerandoPdfCliente ? "Gerando..." : "Enviar via WhatsApp"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Acha o nome do cliente a partir de um pedido, buscando na lista de clientes.
function clienteByPedidoNome(clientes, pedido) {
  if (!pedido) return "";
  const c = (clientes || []).find((cl) => String(cl.pedido).trim() === String(pedido).trim());
  return c?.nome || "";
}


function ComparativoMensalSection({ producaoEsc, producaoPerf }) {
  const meses = useMemo(() => {
    const todaProducao = [...(producaoEsc || []), ...(producaoPerf || [])];
    const mapa = new Map();
    todaProducao.forEach((r) => {
      const chave = dataOrdenavel(r.data).slice(0, 7); // AAAA-MM
      if (!chave || chave.length !== 7) return;
      mapa.set(chave, (mapa.get(chave) || 0) + numeroSeguro(r.total));
    });
    const ordenado = [...mapa.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12);
    return ordenado.map(([chave, valor], i) => {
      const anterior = ordenado[i + 1];
      const variacao = anterior && anterior[1] > 0 ? ((valor - anterior[1]) / anterior[1]) * 100 : null;
      const [ano, mes] = chave.split("-");
      const nomeMes = new Date(`${chave}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      return { chave, nomeMes, valor, variacao };
    });
  }, [producaoEsc, producaoPerf]);

  const maiorValor = Math.max(...meses.map((m) => m.valor), 1);

  return (
    <div>
      {meses.length === 0 ? (
        <EmptyState icon={BarChart3} title="Sem dados suficientes" hint="Precisa ter lançamentos de Produção com data." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {meses.map((m) => (
            <div key={m.chave}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px" }}>
                <span style={{ textTransform: "capitalize" }}>{m.nomeMes}</span>
                <span className="tl-mono">
                  {money(m.valor)}
                  {m.variacao !== null && (
                    <span style={{ color: m.variacao >= 0 ? "var(--success)" : "var(--danger)", marginLeft: "8px", fontSize: "11.5px" }}>
                      {m.variacao >= 0 ? "+" : ""}{m.variacao.toFixed(1)}%
                    </span>
                  )}
                </span>
              </div>
              <div style={{ height: "8px", background: "var(--bg-base)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(m.valor / maiorValor) * 100}%`, background: "var(--amber)" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProdutividadeOperadorSection({ producaoEsc, producaoPerf }) {
  const linhas = useMemo(() => {
    const todaProducao = [...(producaoEsc || []), ...(producaoPerf || [])];
    const mapa = new Map();
    todaProducao.forEach((r) => {
      const nome = String(r.operador || "").trim();
      if (!nome) return;
      if (!mapa.has(nome)) mapa.set(nome, { nome, qtd: 0, total: 0 });
      const acc = mapa.get(nome);
      acc.qtd += 1;
      acc.total += numeroSeguro(r.total);
    });
    return [...mapa.values()].sort((a, b) => b.total - a.total);
  }, [producaoEsc, producaoPerf]);

  return (
    <div>
      {linhas.length === 0 ? (
        <EmptyState icon={Users} title="Sem dados suficientes" hint="Precisa ter lançamentos de Produção com operador preenchido." />
      ) : (
        <Table
          columns={["Operador", "Nº de pedidos", "Valor total gerado", ""]}
          rows={linhas.map((l) => (
            <tr key={l.nome} style={rowStyle}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{l.nome}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{l.qtd}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(l.total)}</td>
              <td style={tdStyle} />
            </tr>
          ))}
        />
      )}
    </div>
  );
}

// Ranking de vendas por vendedor, com uma calculadora de comissão simples
// — digita a porcentagem uma vez, e vê quanto cada vendedor recebe sobre o
// que ele vendeu, sem precisar calcular na mão.
function VendedoresSection({ producaoEsc, producaoPerf }) {
  const [mesFiltro, setMesFiltro] = useState("todos");
  const [percentual, setPercentual] = useState("");
  const [verVendedor, setVerVendedor] = useState(null); // nome do vendedor selecionado

  const mesesDisponiveis = useMemo(() => {
    const todaProducao = [...(producaoEsc || []), ...(producaoPerf || [])];
    const meses = new Set(todaProducao.map((r) => dataOrdenavel(r.data).slice(0, 7)).filter(Boolean));
    return [...meses].sort().reverse();
  }, [producaoEsc, producaoPerf]);

  const producaoFiltrada = useMemo(() => {
    return [...(producaoEsc || []), ...(producaoPerf || [])].filter((r) => {
      if (mesFiltro === "todos") return true;
      return dataOrdenavel(r.data).slice(0, 7) === mesFiltro;
    });
  }, [producaoEsc, producaoPerf, mesFiltro]);

  const qtdSemVendedor = producaoFiltrada.filter((r) => !String(r.vendedor || "").trim()).length;

  const linhas = useMemo(() => {
    const mapa = new Map();
    producaoFiltrada.forEach((r) => {
      const nome = String(r.vendedor || "").trim();
      if (!nome) return;
      // Agrupa por nome "normalizado" (sem diferença de maiúscula/minúscula
      // ou espaço extra) — assim "Carlos", "carlos " e "CARLOS" ficam
      // juntos no mesmo vendedor, em vez de virarem 3 linhas separadas.
      const chave = nome.toLowerCase();
      if (!mapa.has(chave)) mapa.set(chave, { nome, qtd: 0, total: 0, obras: [] });
      const acc = mapa.get(chave);
      acc.qtd += 1;
      acc.total += numeroSeguro(r.total);
      acc.obras.push(r);
    });
    return [...mapa.values()].sort((a, b) => b.total - a.total);
  }, [producaoFiltrada]);

  const totalGeral = linhas.reduce((s, l) => s + l.total, 0);
  const pct = numeroSeguro(percentual);
  const vendedorSelecionado = linhas.find((l) => l.nome === verVendedor);

  return (
    <div>
      {qtdSemVendedor > 0 && (
        <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", marginBottom: "16px", fontSize: "12.5px", color: "var(--text-muted)" }}>
          {qtdSemVendedor} lançamento(s) de Produção no período não têm vendedor preenchido — eles não entram nesse ranking. Preencha o campo "Vendedor" ao editar o lançamento pra aparecer aqui.
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <MiniStat label="Total vendido no período" valor={money(totalGeral)} />
          <Field label="% de comissão" hint="Aplica sobre o valor vendido de cada um">
            <Input
              type="number"
              value={percentual}
              onChange={(e) => setPercentual(e.target.value)}
              placeholder="Ex: 5"
              style={{ width: "110px" }}
            />
          </Field>
        </div>
        <Select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} style={{ width: "180px" }}>
          <option value="todos">Todo período</option>
          {mesesDisponiveis.map((m) => (
            <option key={m} value={m}>{new Date(`${m}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</option>
          ))}
        </Select>
      </div>

      {linhas.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum vendedor com obras vendidas nesse período" hint='Preencha o campo "Vendedor" nos lançamentos de Produção pra ele aparecer aqui.' />
      ) : (
        <Table
          columns={["#", "Vendedor", "Nº de obras", "Valor vendido", pct > 0 ? `Comissão (${pct}%)` : "Comissão"]}
          rows={linhas.map((l, i) => (
            <tr key={l.nome} style={rowStyle}>
              <td style={{ ...tdStyle, color: i === 0 ? "var(--amber)" : "var(--text-muted)", fontWeight: i === 0 ? 700 : 500 }}>
                {i === 0 ? "🏆" : i + 1}
              </td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>
                <button onClick={() => setVerVendedor(l.nome)} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500, textDecoration: "underline", textDecorationColor: "var(--border-soft)" }}>
                  {l.nome}
                </button>
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                <button onClick={() => setVerVendedor(l.nome)} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontWeight: 700 }}>
                  {l.qtd}
                </button>
              </td>
              <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(l.total)}</td>
              <td style={{ ...tdStyle, fontWeight: 600, color: pct > 0 ? "var(--success)" : "var(--text-faint)" }} className="tl-mono">
                {pct > 0 ? money(l.total * (pct / 100)) : "-"}
              </td>
            </tr>
          ))}
        />
      )}

      {vendedorSelecionado && (
        <Modal title={`Obras vendidas — ${vendedorSelecionado.nome}`} onClose={() => setVerVendedor(null)}>
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", marginBottom: "14px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span>{vendedorSelecionado.qtd} obra(s)</span>
            <strong className="tl-mono">{money(vendedorSelecionado.total)}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[...vendedorSelecionado.obras]
              .sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data)))
              .map((r) => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "13px" }}>
                  <div>
                    <strong>Pedido #{r.pedido || "-"}</strong>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      {fmtDate(r.data)} · {r.equipamento || "-"} · {r.cliente || "Cliente não identificado"}
                    </div>
                  </div>
                  <strong className="tl-mono">{money(r.total)}</strong>
                </div>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
}


function FreteSection({ producaoEsc, producaoPerf }) {
  const [verDetalhe, setVerDetalhe] = useState(null); // null | "todos" | nome do motorista

  const todosFretes = useMemo(() => {
    return [...(producaoEsc || []), ...(producaoPerf || [])]
      .filter((r) => numeroSeguro(r.frete) > 0)
      .map((r) => ({
        id: r.id,
        motorista: String(r.motoristaFrete || "Motorista não informado").trim(),
        caminhao: r.caminhaoFrete || "-",
        data: r.data,
        valor: numeroSeguro(r.frete),
        cliente: r.cliente || "-",
        equipamento: r.equipamento || "-",
        pedido: r.pedido || "-",
        tipo: r.tipoFrete || "Leva",
      }))
      .sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data)));
  }, [producaoEsc, producaoPerf]);

  const linhas = useMemo(() => {
    const mapa = new Map();
    todosFretes.forEach((r) => {
      if (!mapa.has(r.motorista)) mapa.set(r.motorista, { nome: r.motorista, viagens: 0, total: 0, caminhoes: new Set() });
      const acc = mapa.get(r.motorista);
      acc.viagens += 1;
      acc.total += r.valor;
      if (r.caminhao && r.caminhao !== "-") acc.caminhoes.add(r.caminhao);
    });
    return [...mapa.values()].sort((a, b) => b.viagens - a.viagens);
  }, [todosFretes]);

  const totalViagens = todosFretes.length;
  const totalFrete = todosFretes.reduce((s, r) => s + r.valor, 0);
  // Ordem cronológica crescente (1ª viagem, 2ª viagem...) — faz mais
  // sentido numerar sequencialmente do mais antigo pro mais novo.
  const fretesFiltrados = [...(verDetalhe && verDetalhe !== "todos" ? todosFretes.filter((r) => r.motorista === verDetalhe) : todosFretes)].sort(
    (a, b) => dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data))
  );

  const abrirRelatorio = (nome) => setVerDetalhe(nome);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setVerDetalhe("todos")} style={{ background: "none", border: "none", padding: 0, cursor: totalViagens > 0 ? "pointer" : "default", textAlign: "left" }} className="tl-focus" disabled={totalViagens === 0}>
          <MiniStat label="Fretes lançados" valor={totalViagens} />
        </button>
        <MiniStat label="Total pago em frete" valor={money(totalFrete)} />
      </div>
      {linhas.length === 0 ? (
        <EmptyState icon={Truck} title="Sem fretes lançados ainda" hint="Preencha o valor de frete e o motorista nos lançamentos de Produção." />
      ) : (
        <Table
          columns={["Motorista", "Nº de fretes", "Caminhão(ões)", "Valor total", ""]}
          rows={linhas.map((l) => (
            <tr key={l.nome} style={rowStyle}>
              <td style={tdStyle}>
                <button onClick={() => abrirRelatorio(l.nome)} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500, textDecoration: "underline", textDecorationColor: "var(--border-soft)" }}>
                  {l.nome}
                </button>
              </td>
              <td style={{ ...tdStyle, fontWeight: 700 }} className="tl-mono">
                <button onClick={() => abrirRelatorio(l.nome)} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontWeight: 700 }}>
                  {l.viagens}
                </button>
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{[...l.caminhoes].join(", ") || "-"}</td>
              <td style={tdStyle} className="tl-mono">{money(l.total)}</td>
              <td style={tdStyle} />
            </tr>
          ))}
        />
      )}

      {verDetalhe && (
        <Modal title={verDetalhe === "todos" ? "Todos os fretes lançados" : `Relatório de fretes — ${verDetalhe}`} onClose={() => setVerDetalhe(null)}>
          {verDetalhe !== "todos" && (
            <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", marginBottom: "14px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span>{fretesFiltrados.length} fretes</span>
              <strong className="tl-mono">{money(fretesFiltrados.reduce((s, r) => s + r.valor, 0))}</strong>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {fretesFiltrados.map((r, i) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "13px" }}>
                <div>
                  <strong>{i + 1}. {r.motorista}</strong>
                  {" "}
                  <span
                    className="tl-mono"
                    style={{
                      fontSize: "10px",
                      padding: "2px 7px",
                      borderRadius: "10px",
                      background: r.tipo === "Traz" ? "#3D2B54" : "#2C3F55",
                      color: r.tipo === "Traz" ? "#CBA6F2" : "#8CBCE8",
                    }}
                  >
                    {r.tipo === "Traz" ? "TRAZ" : "LEVA"}
                  </span>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {fmtDate(r.data)} · Pedido #{r.pedido} · {r.equipamento} · {r.cliente}
                    {r.caminhao !== "-" && ` · ${r.caminhao}`}
                  </div>
                </div>
                <strong className="tl-mono">{money(r.valor)}</strong>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}


// ou da linha digitável (47 dígitos) de um boleto bancário padrão.
function decodificarBoleto(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  let fatorVenc, valorStr;
  if (digits.length === 44) {
    fatorVenc = digits.slice(5, 9);
    valorStr = digits.slice(9, 19);
  } else if (digits.length === 47) {
    fatorVenc = digits.slice(33, 37);
    valorStr = digits.slice(37, 47);
  } else {
    return null;
  }
  const valorNum = parseInt(valorStr, 10) / 100;
  let vencimento = "";
  const fator = parseInt(fatorVenc, 10);
  if (fator > 0) {
    const base = Date.UTC(1997, 9, 7); // 07/10/1997 — data-base oficial FEBRABAN
    const dt = new Date(base + fator * 86400000);
    vencimento = dt.toISOString().slice(0, 10);
  }
  return { valor: isNaN(valorNum) ? "" : valorNum.toFixed(2), vencimento };
}

const emptyConta = (tipo) => ({
  id: uid(),
  tipo, // "Receber" | "Pagar"
  descricao: "",
  pedido: "",
  fornecedor: "",
  valor: "",
  vencimento: new Date().toISOString().slice(0, 10),
  dataPagamento: "",
  status: "Pendente", // Pendente | Pago | Boleto | Cancelado
  formaPagamento: "",
  valorPago: "", // quanto já foi pago de verdade — se for menor que "valor", é pagamento parcial
  dataProximoPagamento: "", // quando o restante deve ser pago, se for parcial
  observacao: "",
});

const FIN_STATUS_STYLES = {
  Pendente: { bg: "#52431D", fg: "#F0B958" },
  Pago: { bg: "#2B4F3A", fg: "#7BC492" },
  Boleto: { bg: "#2C3F55", fg: "#8CBCE8" },
  Pix: { bg: "#3D2B54", fg: "#CBA6F2" },
  Cancelado: { bg: "#532B2B", fg: "#E88886" },
};

function FinStatusBadge({ status, atrasada }) {
  const s = FIN_STATUS_STYLES[status] || { bg: "#262b34", fg: "#9198A6" };
  const label = atrasada && status === "Pendente" ? "ATRASADO" : status.toUpperCase();
  const bg = atrasada && status === "Pendente" ? "#3A1E1E" : s.bg;
  const fg = atrasada && status === "Pendente" ? "#D6706F" : s.fg;
  return (
    <span
      className="tl-mono"
      style={{ background: bg, color: fg, fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", padding: "3px 8px", borderRadius: "3px", whiteSpace: "nowrap" }}
    >
      {label}
    </span>
  );
}

function FinanceiroProducaoSection({ producaoEsc, producaoPerf, onChangeProducaoEsc, onChangeProducaoPerf, tipoFixo }) {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPedido, setFiltroPedido] = useState("");
  const [editando, setEditando] = useState(null);
  const [verRelatorio, setVerRelatorio] = useState(false);

  const todos = useMemo(() => {
    const esc = producaoEsc.map((r) => ({ ...r, tipoEquip: "Escavadeira" }));
    const perf = producaoPerf.map((r) => ({ ...r, tipoEquip: "Perfuratriz" }));
    if (tipoFixo === "Escavadeira") return esc;
    if (tipoFixo === "Perfuratriz") return perf;
    return [...esc, ...perf];
  }, [producaoEsc, producaoPerf, tipoFixo]);

  const statusUsados = useMemo(() => {
    const mapa = new Map();
    todos.forEach((r) => {
      if (!r.status) return;
      const chave = r.status.trim().toUpperCase();
      if (!mapa.has(chave)) mapa.set(chave, r.status.trim());
    });
    return [...mapa.values()].sort();
  }, [todos]);

  const filtrados = todos.filter((r) => {
    if (filtroStatus !== "todos" && String(r.status || "").trim().toUpperCase() !== filtroStatus.toUpperCase()) return false;
    if (filtroPedido.trim() && !String(r.pedido || "").trim().includes(filtroPedido.trim())) return false;
    return true;
  });

  const totalPorStatus = (status) =>
    todos.filter((r) => String(r.status || "").trim().toUpperCase() === status.toUpperCase()).reduce((s, r) => s + numeroSeguro(r.total), 0);

  const alternarStatus = (registro) => {
    const ordem = ["EM ABERTO", "BOLETO", "PIX", "PAGO"];
    const atual = String(registro.status || "EM ABERTO").trim().toUpperCase();
    const idx = ordem.indexOf(atual);
    const proximo = ordem[(idx + 1) % ordem.length];
    if (registro.tipoEquip === "Escavadeira") {
      onChangeProducaoEsc(producaoEsc.map((r) => (r.id === registro.id ? { ...r, status: proximo } : r)));
    } else {
      onChangeProducaoPerf(producaoPerf.map((r) => (r.id === registro.id ? { ...r, status: proximo } : r)));
    }
  };

  const salvarEdicao = (registro, dados) => {
    if (registro.tipoEquip === "Escavadeira") {
      onChangeProducaoEsc(producaoEsc.map((r) => (r.id === registro.id ? { ...r, ...dados } : r)));
    } else {
      onChangeProducaoPerf(producaoPerf.map((r) => (r.id === registro.id ? { ...r, ...dados } : r)));
    }
    setEditando(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "10px", gap: "10px", flexWrap: "wrap" }}>
        <Field label="Buscar por pedido" hint="Deixe em branco pra ver todos">
          <Input value={filtroPedido} onChange={(e) => setFiltroPedido(e.target.value)} placeholder="Ex: 620" style={{ width: "160px" }} />
        </Field>
        <Button icon={FileText} variant="subtle" onClick={() => setVerRelatorio(true)}>Relatório</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <MiniStat
          label="Em aberto"
          valor={money(totalPorStatus("EM ABERTO"))}
          cor="var(--amber)"
          ativo={filtroStatus === "EM ABERTO"}
          onClick={() => setFiltroStatus(filtroStatus === "EM ABERTO" ? "todos" : "EM ABERTO")}
        />
        <MiniStat
          label="Boleto"
          valor={money(totalPorStatus("BOLETO"))}
          cor="#6FA3D6"
          ativo={filtroStatus === "BOLETO"}
          onClick={() => setFiltroStatus(filtroStatus === "BOLETO" ? "todos" : "BOLETO")}
        />
        <MiniStat
          label="Pix"
          valor={money(totalPorStatus("PIX"))}
          cor="#B98FE8"
          ativo={filtroStatus === "PIX"}
          onClick={() => setFiltroStatus(filtroStatus === "PIX" ? "todos" : "PIX")}
        />
        <MiniStat
          label="Pago"
          valor={money(totalPorStatus("PAGO"))}
          cor="var(--success)"
          ativo={filtroStatus === "PAGO"}
          onClick={() => setFiltroStatus(filtroStatus === "PAGO" ? "todos" : "PAGO")}
        />
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: "160px" }}>
          <option value="todos">Todo status</option>
          {statusUsados.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={Wallet} title="Nada por aqui" hint="Nenhum lançamento de produção com esse filtro." />
      ) : (
        <Table
          columns={tipoFixo ? ["Pedido", "Cliente", "Equipamento", "Data", "Total", "Status", ""] : ["Pedido", "Cliente", "Tipo", "Equipamento", "Data", "Total", "Status", ""]}
          rows={[...filtrados]
            .sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data)))
            .map((r) => (
              <tr key={r.id} style={rowStyle}>
                <td style={tdStyle}><PedidoStub n={r.pedido} /></td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{r.cliente || "-"}</td>
                {!tipoFixo && <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.tipoEquip}</td>}
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.equipamento || "-"}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(r.total)}</td>
                <td style={tdStyle}>
                  <button onClick={() => alternarStatus(r)} className="tl-focus" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} title="Clique pra avançar o status">
                    <StatusBadge status={r.status} />
                  </button>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <button onClick={() => setEditando(r)} className="tl-focus" style={iconBtnStyle} title="Editar valor/data">
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
        />
      )}

      {editando && <EditarProducaoFinanceiroModal registro={editando} onSave={(dados) => salvarEdicao(editando, dados)} onClose={() => setEditando(null)} />}
      {verRelatorio && <RelatorioProducaoFinanceiro itens={filtrados} tipoFixo={tipoFixo} onClose={() => setVerRelatorio(false)} />}
    </div>
  );
}

function RelatorioProducaoFinanceiro({ itens, tipoFixo, onClose }) {
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [aviso, setAviso] = useState("");

  const titulo = tipoFixo ? `Produção ${tipoFixo}` : "Produção";
  const totalGeral = itens.reduce((s, r) => s + numeroSeguro(r.total), 0);

  const porStatus = useMemo(() => {
    const ordem = ["EM ABERTO", "BOLETO", "PIX", "PAGO"];
    return ordem
      .map((status) => {
        const doStatus = itens.filter((r) => String(r.status || "").trim().toUpperCase() === status);
        const total = doStatus.reduce((s, r) => s + numeroSeguro(r.total), 0);
        return { status, itens: doStatus, total };
      })
      .filter((g) => g.itens.length > 0);
  }, [itens]);

  const enviar = async () => {
    setGerandoPdf(true);
    setAviso("");
    const blob = await gerarPdfRelatorioProducaoFinanceiro(titulo, porStatus, totalGeral);
    setGerandoPdf(false);

    const texto =
      `*Relatório — ${titulo}*\n\n` +
      porStatus.map((g) => `${g.status}: ${g.itens.length} (${money(g.total)})`).join("\n") +
      `\n\nTotal geral: ${money(totalGeral)}\n\n${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;

    if (!blob) {
      setAviso("Geração de PDF não disponível nesta pré-visualização — no site publicado, este botão manda o documento com a logo.");
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
      return;
    }

    const fileName = `relatorio-${titulo.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (ehCelular && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: titulo, text: PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa" });
        return;
      } catch (e) {
        /* segue pro download abaixo */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.alert(`PDF baixado como "${fileName}" (confira a pasta Downloads).\n\nO WhatsApp vai abrir agora só com o texto — anexe esse arquivo baixado na conversa antes de enviar.`);
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
    setAviso("PDF baixado e WhatsApp aberto — é só anexar o arquivo baixado na conversa.");
  };

  return (
    <Modal title={`Relatório — ${titulo}`} onClose={onClose} wide>
      <div className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", borderRadius: "6px", padding: "28px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #1a1a1a", paddingBottom: "14px", marginBottom: "20px" }}>
          <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", borderRadius: "6px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "19px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{[PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" — ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px" }}>RELATÓRIO</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{titulo}</div>
          </div>
        </div>

        <div style={{ marginBottom: "18px", fontSize: "13px" }}>
          <strong>Total geral: {money(totalGeral)}</strong>
        </div>

        {porStatus.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#777" }}>Nenhum lançamento ainda.</p>
        ) : (
          porStatus.map((g) => (
            <div key={g.status} style={{ marginBottom: "18px" }}>
              <strong style={{ fontSize: "13.5px" }}>{g.status} ({g.itens.length}) — {money(g.total)}</strong>
              {g.itens.map((r) => (
                <ReportRow
                  key={r.id}
                  label={`${r.cliente || "-"} — ${fmtDate(r.data)} (${r.equipamento || "-"}${!tipoFixo ? `, ${r.tipoEquip}` : ""})`}
                  value={money(r.total)}
                />
              ))}
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button
          variant="subtle"
          icon={MessageCircle}
          disabled={gerandoPdf}
          style={{ background: "#25D366", color: "#fff", borderColor: "#25D366", fontWeight: 700 }}
          onClick={enviar}
        >
          {gerandoPdf ? "Gerando PDF..." : "WhatsApp"}
        </Button>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      {aviso && <p style={{ fontSize: "12.5px", color: "var(--amber)", marginTop: "10px", textAlign: "right" }}>{aviso}</p>}
    </Modal>
  );
}
function EditarProducaoFinanceiroModal({ registro, onSave, onClose }) {
  const [total, setTotal] = useState(registro.total ?? "");
  const [data, setData] = useState(registro.data || "");
  const [status, setStatus] = useState(registro.status || "EM ABERTO");

  return (
    <Modal title={`Editar — Pedido nº ${registro.pedido || "avulso"}`} onClose={onClose}>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "14px" }}>
        {registro.tipoEquip} · {registro.cliente || "-"} · {registro.equipamento || "-"}
      </p>
      <Field label="Total (R$)">
        <Input type="number" step="0.01" value={total} onChange={(e) => setTotal(e.target.value)} />
      </Field>
      <Field label="Data">
        <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      </Field>
      <Field label="Status">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {["EM ABERTO", "BOLETO", "PIX", "PAGO"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave({ total: numeroSeguro(total), data, status })}>Salvar</Button>
      </div>
    </Modal>
  );
}


function FinanceiroModule({ contas, clientes, clienteByPedido, producaoEsc, producaoPerf, onChangeProducaoEsc, onChangeProducaoPerf, despesas, onChangeDespesas, onChange, propostas }) {
  const [verRelatorioGeral, setVerRelatorioGeral] = useState(null); // pedido selecionado
  const qtdReceber = contas.filter((c) => c.tipo === "Receber").length;
  const qtdPagar = contas.filter((c) => c.tipo === "Pagar").length;
  const [subTab, setSubTab] = useState(() => (qtdReceber === 0 && qtdPagar > 0 ? "pagar" : "receber"));
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [recibo, setRecibo] = useState(null);
  const [emitindoRecibo, setEmitindoRecibo] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos"); // todos | Pendente | Boleto | Pago | Cancelado | em-aberto | atrasado
  const [somenteZerados, setSomenteZerados] = useState(false);
  const [buscaPedido, setBuscaPedido] = useState("");

  const hojeISO = new Date().toISOString().slice(0, 10);
  const tipoAtual = subTab === "pagar" ? "Pagar" : "Receber";

  // Quando a conta editada está amarrada a uma Despesa Fixa (despesaId),
  // espelha a mudança pra lá também — assim marcar como pago em qualquer
  // um dos dois lugares atualiza o outro sozinho.
  const sincronizarDespesa = (conta) => {
    if (!conta.despesaId || !despesas || !onChangeDespesas) return;
    const existeDespesa = despesas.some((d) => d.id === conta.despesaId);
    if (!existeDespesa) return;
    onChangeDespesas(
      despesas.map((d) =>
        d.id === conta.despesaId
          ? { ...d, status: conta.status === "Pago" ? "Pago" : "Pendente", dataPagamento: conta.dataPagamento || d.dataPagamento, valor: conta.valor, vencimento: conta.vencimento || d.vencimento }
          : d
      )
    );
  };

  // Mesma ideia, mas pra contas amarradas a um lançamento de Produção
  // (producaoId) — mudar o status aqui também muda lá.
  const sincronizarProducao = (conta) => {
    if (!conta.producaoId) return;
    const mapaVolta = { Pendente: "EM ABERTO", Boleto: "BOLETO", Pix: "PIX", Pago: "PAGO" };
    const novoStatusProducao = mapaVolta[conta.status] || "EM ABERTO";
    if (producaoEsc.some((r) => r.id === conta.producaoId)) {
      onChangeProducaoEsc(producaoEsc.map((r) => (r.id === conta.producaoId ? { ...r, status: novoStatusProducao } : r)));
    } else if (producaoPerf.some((r) => r.id === conta.producaoId)) {
      onChangeProducaoPerf(producaoPerf.map((r) => (r.id === conta.producaoId ? { ...r, status: novoStatusProducao } : r)));
    }
  };

  // Antes, isso fechava a tela de "editar conta" na hora, sem esperar o
  // salvamento terminar. Se o salvamento fosse recusado (por exemplo,
  // porque essa mesma conta tinha sido alterada em outra aba/aparelho
  // enquanto você editava — muito comum quando o sistema fica aberto em
  // mais de uma aba do navegador), a tela fechava do mesmo jeito, dando a
  // falsa impressão de que salvou — e ao reabrir aparecia o valor antigo
  // de novo. Agora espera a confirmação de que salvou de verdade antes de
  // fechar; se não salvar, a tela continua aberta com o que você digitou,
  // pra você tentar de novo (o aviso vermelho no topo explica o motivo).
  const save = async (conta) => {
    const exists = contas.some((c) => c.id === conta.id);
    const salvou = await onChange(exists ? contas.map((c) => (c.id === conta.id ? conta : c)) : [...contas, conta]);
    if (salvou === false) return;
    sincronizarDespesa(conta);
    sincronizarProducao(conta);
    setEditing(null);
  };
  const remove = (id) => {
    const alvo = contas.find((c) => c.id === id);
    onChange(contas.filter((c) => c.id !== id));
    // Apagar a conta amarrada a uma despesa apaga a despesa também — os
    // dois lados representam a mesma coisa, então ficam sincronizados.
    if (alvo?.despesaId && despesas && onChangeDespesas) {
      onChangeDespesas(despesas.filter((d) => d.id !== alvo.despesaId));
    }
    setDeleting(null);
  };
  const marcarPago = (conta) => {
    const atualizada = { ...conta, status: "Pago", dataPagamento: conta.dataPagamento || hojeISO };
    onChange(contas.map((c) => (c.id === conta.id ? atualizada : c)));
    sincronizarDespesa(atualizada);
    sincronizarProducao(atualizada);
  };

  // Abre o recibo já com o detalhamento completo da Produção (máquina,
  // diária, frete, retirada de material, viagens) daquele pedido — mesma
  // busca que o "Emitir recibo" avulso já faz.
  const abrirRecibo = (conta) => {
    const pedido = String(conta.pedido || "").trim();
    if (!pedido) {
      setRecibo(conta);
      return;
    }
    const esc = producaoEsc.filter((r) => String(r.pedido).trim() === pedido).map((r) => ({ ...r, tipoEquip: "Escavadeira" }));
    const perf = producaoPerf.filter((r) => String(r.pedido).trim() === pedido).map((r) => ({ ...r, tipoEquip: "Perfuratriz" }));
    const producaoDetalhe = [...esc, ...perf].sort((a, b) => dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data)));
    setRecibo({ ...conta, producaoDetalhe });
  };

  const listaBase = contas.filter((c) => c.tipo === tipoAtual);
  // Falta pagar de verdade — desconta o que já foi recebido/pago em
  // partes (valorPago), mesmo pra contas que ainda estão "Pendente". Sem
  // isso, uma conta com pagamento parcial aparecia com o valor cheio nos
  // cartões de resumo e na lista, como se nada tivesse sido pago ainda.
  const faltaPagarConta = (c) => {
    const pago = c.valorPago !== "" && c.valorPago !== undefined && c.valorPago !== null ? numeroSeguro(c.valorPago) : (c.status === "Pago" ? numeroSeguro(c.valor) : 0);
    return Math.max(0, numeroSeguro(c.valor) - pago);
  };

  const lista = listaBase.filter((c) => {
    if (somenteZerados && numeroSeguro(c.valor) !== 0) return false;
    if (buscaPedido.trim() && !String(c.pedido || "").toLowerCase().includes(buscaPedido.trim().toLowerCase())) return false;
    if (filtroStatus === "todos") return true;
    if (filtroStatus === "em-aberto") return c.status === "Pendente" || c.status === "Boleto" || c.status === "Pix";
    if (filtroStatus === "atrasado") return c.status === "Pendente" && dataOrdenavel(c.vencimento) < hojeISO;
    return c.status === filtroStatus;
  });

  const qtdZerados = listaBase.filter((c) => numeroSeguro(c.valor) === 0).length;

  const totalPendente = listaBase.filter((c) => c.status === "Pendente" || c.status === "Boleto" || c.status === "Pix").reduce((s, c) => s + faltaPagarConta(c), 0);
  const totalPago = listaBase.filter((c) => c.status === "Pago").reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const totalAtrasado = listaBase.filter((c) => c.status === "Pendente" && dataOrdenavel(c.vencimento) < hojeISO).reduce((s, c) => s + faltaPagarConta(c), 0);

  // Resumo do pedido digitado na busca — soma tudo daquele pedido e quebra
  // por status (Pendente, Boleto, Pago, Cancelado, Atrasado), pra saber de
  // cara quanto esse pedido específico já pagou e quanto ainda falta.
  const resumoPedidoBuscado = useMemo(() => {
    const alvo = buscaPedido.trim();
    if (!alvo) return null;
    const doPedido = listaBase.filter((c) => String(c.pedido || "").trim() === alvo);
    if (doPedido.length === 0) return null;
    const porStatus = {};
    doPedido.forEach((c) => {
      const st = c.status || "Sem status";
      porStatus[st] = (porStatus[st] || 0) + numeroSeguro(c.valor);
    });
    const totalAtrasadoPedido = doPedido
      .filter((c) => c.status === "Pendente" && dataOrdenavel(c.vencimento) < hojeISO)
      .reduce((s, c) => s + numeroSeguro(c.valor), 0);
    const totalPedido = doPedido.reduce((s, c) => s + numeroSeguro(c.valor), 0);
    return { pedido: alvo, totalPedido, porStatus, totalAtrasadoPedido, qtd: doPedido.length };
  }, [buscaPedido, listaBase, hojeISO]);

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Financeiro" title="Contas a Pagar & Receber" />

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "4px", flexWrap: "wrap" }}>
        {[
          { id: "receber", label: "A Receber", icon: TrendingUp, qtd: qtdReceber },
          { id: "pagar", label: "A Pagar", icon: TrendingDown, qtd: qtdPagar },
          { id: "producaoEsc", label: "Produção-Concreto", icon: Truck, qtd: producaoEsc.length },
          { id: "relatorio", label: "Relatório", icon: BarChart2 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className="tl-focus"
            style={{
              flex: "1 1 auto",
              minWidth: "110px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "8px 10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: subTab === t.id ? "var(--bg-panel-raised)" : "transparent",
              color: subTab === t.id ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "12.5px",
              fontWeight: subTab === t.id ? 600 : 500,
            }}
          >
            <t.icon size={14} />
            {t.label}
            {typeof t.qtd === "number" && (
              <span className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)" }}>({t.qtd})</span>
            )}
          </button>
        ))}
      </div>

      {subTab === "relatorio" ? (
        <FinanceiroRelatorio contas={contas} producaoEsc={producaoEsc} producaoPerf={producaoPerf} onVerPedido={setVerRelatorioGeral} />
      ) : subTab === "producaoEsc" ? (
        <FinanceiroProducaoSection
          producaoEsc={producaoEsc}
          producaoPerf={producaoPerf}
          onChangeProducaoEsc={onChangeProducaoEsc}
          onChangeProducaoPerf={onChangeProducaoPerf}
          tipoFixo="Escavadeira"
        />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            <MiniStat
              label={subTab === "pagar" ? "Em aberto (a pagar)" : "Em aberto (a receber)"}
              valor={money(totalPendente)}
              cor="var(--amber)"
              ativo={filtroStatus === "em-aberto"}
              onClick={() => setFiltroStatus(filtroStatus === "em-aberto" ? "todos" : "em-aberto")}
            />
            <MiniStat
              label="Atrasado"
              valor={money(totalAtrasado)}
              cor="var(--danger)"
              ativo={filtroStatus === "atrasado"}
              onClick={() => setFiltroStatus(filtroStatus === "atrasado" ? "todos" : "atrasado")}
            />
            <MiniStat
              label={subTab === "pagar" ? "Pago no período" : "Recebido no período"}
              valor={money(totalPago)}
              cor="var(--success)"
              ativo={filtroStatus === "Pago"}
              onClick={() => setFiltroStatus(filtroStatus === "Pago" ? "todos" : "Pago")}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Input
                placeholder="Buscar por nº do pedido"
                value={buscaPedido}
                onChange={(e) => setBuscaPedido(e.target.value)}
                style={{ width: "180px" }}
              />
              <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: "200px" }}>
                <option value="todos">Todos os status</option>
                <option value="em-aberto">Em aberto (pendente + boleto)</option>
                <option value="atrasado">Atrasado</option>
                <option value="Pendente">Pendente</option>
                <option value="Boleto">Boleto</option>
                <option value="Pago">Pago</option>
                <option value="Cancelado">Cancelado</option>
              </Select>
              <Button size="sm" variant={somenteZerados ? "primary" : "subtle"} onClick={() => setSomenteZerados(!somenteZerados)} type="button">
                {somenteZerados ? "✓ " : ""}Só valor zerado ({qtdZerados})
              </Button>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button icon={Receipt} variant="subtle" onClick={() => setEmitindoRecibo(true)}>
                Emitir recibo
              </Button>
              <Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("conta", () => emptyConta(tipoAtual)))}>
                Nova conta {subTab === "pagar" ? "a pagar" : "a receber"}
              </Button>
            </div>
          </div>

          {resumoPedidoBuscado && (
            <div style={{ background: "var(--bg-panel)", border: "1px solid var(--accent)", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Pedido #{resumoPedidoBuscado.pedido} — {resumoPedidoBuscado.qtd} lançamento{resumoPedidoBuscado.qtd === 1 ? "" : "s"}
                </span>
                <strong className="tl-mono" style={{ fontSize: "16px" }}>{money(resumoPedidoBuscado.totalPedido)}</strong>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12.5px" }}>
                {Object.entries(resumoPedidoBuscado.porStatus).map(([status, valor]) => (
                  <div key={status} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <StatusBadge status={status} />
                    <strong className="tl-mono">{money(valor)}</strong>
                  </div>
                ))}
                {resumoPedidoBuscado.totalAtrasadoPedido > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <StatusBadge status="ATRASADO" />
                    <strong className="tl-mono" style={{ color: "var(--danger)" }}>{money(resumoPedidoBuscado.totalAtrasadoPedido)}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {somenteZerados && lista.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                background: "#3A2F13",
                border: "1px solid #5A4A1F",
                borderRadius: "7px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "#E8A63D" }}>
                {lista.length} conta(s) com valor zerado nessa lista.
              </span>
              <Button
                size="sm"
                variant="subtle"
                icon={Trash2}
                onClick={() => {
                  if (window.confirm(`Excluir as ${lista.length} contas zeradas listadas agora? Depois é só reimportar a planilha que elas voltam com o valor certo.`)) {
                    const idsExcluir = new Set(lista.map((c) => c.id));
                    onChange(contas.filter((c) => !idsExcluir.has(c.id)));
                  }
                }}
              >
                Excluir estas {lista.length}
              </Button>
            </div>
          )}

          {lista.length === 0 ? (
            <EmptyState icon={Wallet} title="Nenhuma conta ainda" hint={`Cadastre contas ${subTab === "pagar" ? "a pagar" : "a receber"} pra acompanhar o caixa.`} />
          ) : (
            <Table
              columns={
                subTab === "pagar"
                  ? ["Pedido", "Fornecedor", "Descrição", "Vencimento", "Valor", "Falta pagar", "Status", ""]
                  : ["Pedido", "Cliente", "Descrição", "Data de compra", "Vencimento", "Valor", "Falta pagar", "Status", ""]
              }
              rows={[...lista].sort((a, b) => dataOrdenavel(b.vencimento).localeCompare(dataOrdenavel(a.vencimento))).map((c) => {
                const atrasada = c.status === "Pendente" && dataOrdenavel(c.vencimento) && dataOrdenavel(c.vencimento) < hojeISO;
                const cliente = c.pedido ? clienteByPedido.get(String(c.pedido).trim()) : null;
                const falta = faltaPagarConta(c);
                return (
                  <tr key={c.id} style={rowStyle}>
                    <td style={tdStyle}>
                      {c.pedido ? (
                        <button onClick={() => setVerRelatorioGeral(String(c.pedido).trim())} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} title="Ver relatório geral desse pedido">
                          <PedidoStub n={c.pedido} />
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-faint)" }}>-</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>
                      {subTab === "pagar" ? c.fornecedor || "-" : cliente ? cliente.nome : c.pedido ? "-" : "-"}
                    </td>
                    <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{c.descricao || "-"}</td>
                    {subTab === "receber" && (
                      <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{c.dataServico ? fmtDate(c.dataServico) : "-"}</td>
                    )}
                    <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(c.vencimento)}</td>
                    <td style={tdStyle} className="tl-mono">{money(c.valor)}</td>
                    <td style={{ ...tdStyle, fontWeight: falta > 0.005 ? 700 : 400 }} className="tl-mono">
                      {falta > 0.005 ? <span style={{ color: "var(--danger)" }}>{money(falta)}</span> : <span style={{ color: "var(--success)" }}>Quitado</span>}
                    </td>
                    <td style={tdStyle}><FinStatusBadge status={c.status} atrasada={atrasada} /></td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "4px" }}>
                        {c.status !== "Pago" && (
                          <button onClick={() => marcarPago(c)} className="tl-focus" style={iconBtnStyle} title="Marcar como pago">
                            <CheckIcon />
                          </button>
                        )}
                        {subTab === "receber" && c.status === "Pago" && (
                          <button onClick={() => abrirRecibo(c)} className="tl-focus" style={iconBtnStyle} title="Emitir recibo">
                            <FileText size={14} />
                          </button>
                        )}
                        <RowActions onEdit={() => setEditing(c)} onDelete={() => setDeleting(c)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            />
          )}
        </>
      )}

      {editing && (
        <ContaForm initial={editing} clienteByPedido={clienteByPedido} contas={contas} onSave={save} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDelete label={`a conta "${deleting.descricao || deleting.id}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
      {recibo && (
        <ReciboView conta={recibo} cliente={recibo.pedido ? clienteByPedido.get(String(recibo.pedido).trim()) : null} onClose={() => setRecibo(null)} />
      )}
      {emitindoRecibo && (
        <EmitirReciboModal
          clienteByPedido={clienteByPedido}
          producaoEsc={producaoEsc}
          producaoPerf={producaoPerf}
          onEmitir={(conta) => { setRecibo(conta); setEmitindoRecibo(false); }}
          onClose={() => setEmitindoRecibo(false)}
        />
      )}
      {verRelatorioGeral && (
        <RelatorioGeralPedido
          pedido={verRelatorioGeral}
          cliente={clienteByPedido.get(verRelatorioGeral)}
          producaoEsc={producaoEsc}
          producaoPerf={producaoPerf}
          propostas={propostas}
          financeiro={contas}
          onClose={() => setVerRelatorioGeral(null)}
        />
      )}
    </div>
  );
}

function EmitirReciboModal({ clienteByPedido, producaoEsc, producaoPerf, onEmitir, onClose }) {
  const [pedido, setPedido] = useState("");
  const [valor, setValor] = useState("");
  const [valorEditadoManualmente, setValorEditadoManualmente] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().slice(0, 10));
  const [formaPagamento, setFormaPagamento] = useState("");

  const cliente = pedido ? clienteByPedido.get(pedido.trim()) : null;

  // Puxa tudo que já foi lançado em Produção (Escavadeira + Perfuratriz)
  // pra esse pedido — máquina, dias, frete, retirada de material, viagens.
  const lancamentos = useMemo(() => {
    if (!pedido.trim()) return [];
    const esc = (producaoEsc || []).filter((r) => String(r.pedido).trim() === pedido.trim()).map((r) => ({ ...r, tipoEquip: "Escavadeira" }));
    const perf = (producaoPerf || []).filter((r) => String(r.pedido).trim() === pedido.trim()).map((r) => ({ ...r, tipoEquip: "Perfuratriz" }));
    return [...esc, ...perf].sort((a, b) => dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data)));
  }, [pedido, producaoEsc, producaoPerf]);

  const maquinasUsadas = [...new Set(lancamentos.map((r) => r.equipamento).filter(Boolean))];
  const dias = lancamentos.length;
  const totalFrete = lancamentos.reduce((s, r) => s + numeroSeguro(r.frete), 0);
  const totalDiarias = lancamentos.reduce((s, r) => s + numeroSeguro(r.valorDiaria), 0);
  const comRetirada = lancamentos.filter((r) => r.retiradaMaterial).length;
  const totalViagens = lancamentos.reduce((s, r) => s + (r.viagens || []).length, 0);
  const valorViagens = lancamentos.reduce((s, r) => s + (r.viagens || []).reduce((s2, v) => s2 + subtotalCarga(v) + (Number(v.valorBomba) || 0), 0), 0);
  const totalGeralLancamentos = lancamentos.reduce((s, r) => s + numeroSeguro(r.total), 0);

  // Preenche valor e descrição sozinho a partir do que foi encontrado —
  // mas só enquanto o usuário não tiver digitado algo diferente na mão.
  useEffect(() => {
    if (lancamentos.length === 0) return;
    if (!valorEditadoManualmente) setValor(String(totalGeralLancamentos.toFixed(2)));
    if (!descricao) {
      const partes = [`Locação de ${maquinasUsadas.join(", ") || "equipamento"}`, `${dias} dia(s)`];
      setDescricao(partes.join(" — "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lancamentos.length]);

  const submit = (e) => {
    e.preventDefault();
    if (!valor) return;
    onEmitir({
      id: uid(),
      pedido: pedido.trim(),
      tipo: "Receber",
      descricao: descricao.trim(),
      valor: numeroSeguro(valor),
      dataPagamento,
      vencimento: dataPagamento,
      status: "Pago",
      formaPagamento,
      producaoDetalhe: lancamentos,
    });
  };

  return (
    <Modal title="Emitir recibo de pagamento" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Nº do pedido" hint="Puxa cliente e produção lançada automaticamente">
          <Input value={pedido} onChange={(e) => setPedido(e.target.value)} placeholder="Ex: 620" autoFocus />
        </Field>

        {pedido.trim() && (
          <div style={{ marginBottom: "16px", fontSize: "12.5px" }}>
            {cliente ? (
              <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", color: "var(--success)", marginBottom: "8px" }}>
                ✓ <strong>{cliente.nome}</strong>
                {cliente.telefone && <> · {cliente.telefone}</>}
                {cliente.endereco && <><br />{cliente.endereco}</>}
                {cliente.cpf && <><br />CPF/CNPJ: {cliente.cpf}</>}
              </div>
            ) : (
              <div style={{ color: "var(--text-faint)", marginBottom: "8px" }}>Pedido não encontrado em Clientes — o recibo sai sem nome do cliente.</div>
            )}

            {lancamentos.length > 0 ? (
              <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px" }}>
                <strong>{lancamentos.length} lançamento(s) de produção encontrados:</strong>
                <div style={{ marginTop: "6px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  Máquina(s): {maquinasUsadas.join(", ") || "-"}<br />
                  Dias trabalhados: {dias}<br />
                  Total diárias: {money(totalDiarias)}<br />
                  Total frete: {money(totalFrete)}<br />
                  Retirada de material: {comRetirada > 0 ? `Sim, em ${comRetirada} lançamento(s)` : "Não"}<br />
                  Viagens: {totalViagens} ({money(valorViagens)})<br />
                  <strong style={{ color: "var(--text-primary)" }}>Total lançado: {money(totalGeralLancamentos)}</strong>
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-faint)" }}>Nenhum lançamento de Produção encontrado pra esse pedido — preencha o valor manualmente.</div>
            )}
          </div>
        )}

        <Field label="Descrição do serviço">
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Locação de equipamento" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Valor pago (R$)" required hint={lancamentos.length > 0 ? "Preenchido a partir da produção — pode ajustar" : undefined}>
            <Input type="number" step="0.01" value={valor} onChange={(e) => { setValor(e.target.value); setValorEditadoManualmente(true); }} required />
          </Field>
          <Field label="Data do pagamento">
            <Input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} />
          </Field>
        </div>

        <Field label="Forma de pagamento (opcional)">
          <Input value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} placeholder="Ex: Pix, dinheiro, boleto" />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" icon={Receipt}>Gerar recibo</Button>
        </div>
      </form>
    </Modal>
  );
}

function ReciboView({ conta, cliente, onClose }) {
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [aviso, setAviso] = useState("");
  const nomeCliente = cliente?.nome || "-";
  const dataPagamento = conta.dataPagamento || conta.vencimento;
  const numeroRecibo = String(conta.id).slice(-6).toUpperCase();

  // O valor do pedido/serviço é sempre o que está gravado na própria conta
  // (o que foi editado em Financeiro) — nunca recalculado somando outros
  // lançamentos de Produção com o mesmo número de pedido, porque isso podia
  // trazer um total diferente do que a conta realmente tem (o bug do
  // recibo "não bater o valor real"). O "producaoDetalhe" só serve pra
  // montar a lista de itens do detalhamento abaixo, não pra recalcular o
  // valor do pedido.
  const producaoDetalhe = conta.producaoDetalhe || [];
  const valorTotal = numeroSeguro(conta.valor);
  // Quanto foi de fato recebido nesse recibo: usa "valor pago" da conta se
  // tiver sido preenchido; senão assume o status — Pago quer dizer tudo
  // recebido, senão não presume nada recebido ainda.
  const valorRecebido = conta.valorPago !== "" && conta.valorPago !== undefined && conta.valorPago !== null
    ? numeroSeguro(conta.valorPago)
    : (conta.status === "Pago" ? valorTotal : 0);
  const saldoEmAberto = Math.max(0, valorTotal - valorRecebido);
  const datasOrdenadas = [...new Set(producaoDetalhe.map((r) => r.data).filter(Boolean))].sort((a, b) => dataOrdenavel(a).localeCompare(dataOrdenavel(b)));
  const periodoTexto =
    datasOrdenadas.length === 0
      ? ""
      : datasOrdenadas.length === 1
      ? `, do dia ${fmtDate(datasOrdenadas[0])}`
      : `, do dia ${fmtDate(datasOrdenadas[0])} ao dia ${fmtDate(datasOrdenadas[datasOrdenadas.length - 1])}`;
  const equipamentosTexto = [...new Set(producaoDetalhe.map((r) => r.equipamento).filter(Boolean))].join(", ");

  const enviar = async () => {
    setGerandoPdf(true);
    setAviso("");
    const blob = await gerarPdfRecibo(conta, cliente, numeroRecibo);
    setGerandoPdf(false);

    const texto =
      `*Recibo de Pagamento — ${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}*\n\n` +
      `Recibo nº ${numeroRecibo}\n` +
      `Recebemos de: ${nomeCliente}\n` +
      `Referente a: ${conta.descricao || "-"}\n` +
      `Valor: ${money(valorRecebido)}\n` +
      `Data do pagamento: ${fmtDate(dataPagamento)}\n\n${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;

    let telefone = (cliente?.telefone || "").replace(/\D/g, "");
    const abrirTextoSimples = () => {
      if (!telefone) {
        const digitado = window.prompt("Cliente sem telefone cadastrado. Digite o número (com DDD):", "");
        telefone = (digitado || "").replace(/\D/g, "");
        if (!telefone) return;
      }
      const numeroFinal = telefone.startsWith("55") ? telefone : `55${telefone}`;
      window.open(`https://wa.me/${numeroFinal}?text=${encodeURIComponent(texto)}`, "_blank");
    };

    if (!blob) {
      setAviso("Geração de PDF não disponível nesta pré-visualização — enviando como texto. No site publicado, este botão manda o documento com a logo.");
      abrirTextoSimples();
      return;
    }

    const fileName = `recibo-${numeroRecibo}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (ehCelular && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Recibo nº ${numeroRecibo}`, text: `Recibo de pagamento - ${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}` });
        return;
      } catch (e) {
        /* segue para o download abaixo */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.alert(`PDF baixado como "${fileName}" (confira a pasta Downloads).\n\nO WhatsApp vai abrir agora só com o texto — anexe esse arquivo baixado na conversa antes de enviar.`);
    abrirTextoSimples();
    setAviso("PDF baixado e WhatsApp aberto — é só anexar o arquivo baixado na conversa.");
  };

  return (
    <Modal title="Recibo de pagamento" onClose={onClose} wide>
      <div className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", borderRadius: "6px", padding: "28px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #1a1a1a", paddingBottom: "14px", marginBottom: "20px" }}>
          <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", borderRadius: "6px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "19px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{[PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" — ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px" }}>RECIBO Nº {numeroRecibo}</div>
            {conta.pedido && <div style={{ fontSize: "11px", color: "#555" }}>Pedido nº {conta.pedido}</div>}
          </div>
        </div>

        <p style={{ fontSize: "14px", lineHeight: 1.8, marginBottom: "24px" }}>
          Recebemos de <strong>{nomeCliente}</strong>{cliente?.cpf ? ` (CPF/CNPJ ${cliente.cpf})` : ""}, a quantia de{" "}
          <strong>{money(valorRecebido)}</strong>, referente a <strong>{conta.descricao || "serviço prestado"}</strong>
          {equipamentosTexto && ` (${equipamentosTexto})`}
          {conta.pedido ? `, pedido nº ${conta.pedido}` : ""}
          {periodoTexto}, pago em {fmtDate(dataPagamento)}
          {conta.formaPagamento ? ` via ${conta.formaPagamento}` : ""}.
          {saldoEmAberto > 0.005 && (
            <><br /><span style={{ color: "#a15c00" }}>Valor total do pedido: {money(valorTotal)} — saldo em aberto: {money(saldoEmAberto)}.</span></>
          )}
        </p>

        {(conta.producaoDetalhe || []).length > 0 && (() => {
          // Detalhamento do serviço — separado em Concreto e Bomba (nunca
          // "Escavadeira"/"Frete"/"Viagens", que eram nomes de campos
          // antigos e não diziam nada sobre o que foi entregue). O valor do
          // concreto usa as cargas reais lançadas na Central de Balança
          // quando existem; sem cargas, cai pro valor por m³ do lançamento.
          const itensRecibo = [];
          conta.producaoDetalhe.forEach((r) => {
            const especConcreto = [r.fck, r.brita, r.slump ? `SLUMP ${r.slump}` : ""].filter(Boolean).join(" - ");
            const viagensConcreto = (r.viagens || []).reduce((s, v) => s + subtotalCarga(v), 0);
            const valorConcreto = viagensConcreto > 0 ? viagensConcreto : numeroSeguro(r.valorDiaria);
            if (valorConcreto > 0) itensRecibo.push({ label: `Concreto${especConcreto ? ` — ${especConcreto}` : ""} — ${fmtDate(r.data)}`, valor: valorConcreto });
            const valorBomba = numeroSeguro(r.frete) + (r.viagens || []).reduce((s, v) => s + numeroSeguro(v.valorBomba), 0);
            if (valorBomba > 0) itensRecibo.push({ label: `Bomba — ${fmtDate(r.data)}`, valor: valorBomba });
          });
          const totalItens = itensRecibo.reduce((s, it) => s + it.valor, 0);
          if (itensRecibo.length === 0) return null;
          return (
            <div style={{ marginBottom: "24px", border: "1px solid #ddd", borderRadius: "6px", padding: "14px 16px" }}>
              <strong style={{ fontSize: "13px" }}>Detalhamento do serviço</strong>
              <div style={{ marginTop: "8px" }}>
                {itensRecibo.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #eee", fontSize: "13px" }}>
                    <span>{i + 1}. {item.label}</span>
                    <span className="tl-mono">{money(item.valor)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0 0", fontWeight: 700, fontSize: "14px" }}>
                  <span>Total do pedido</span>
                  <span className="tl-mono">{money(totalItens)}</span>
                </div>
              </div>
            </div>
          );
        })()}

        <p style={{ fontSize: "13px", color: "#555" }}>Para maior clareza e por ser verdade, firmamos o presente recibo.</p>

        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #999", width: "260px", margin: "0 auto", paddingTop: "6px", fontSize: "12px" }}>
            {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button variant="subtle" icon={MessageCircle} disabled={gerandoPdf} onClick={enviar}>
          {gerandoPdf ? "Gerando PDF..." : "WhatsApp"}
        </Button>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      {aviso && <p style={{ fontSize: "12.5px", color: "var(--amber)", marginTop: "10px", textAlign: "right" }}>{aviso}</p>}
    </Modal>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Gráfico de barras simples, feito em SVG puro — sem depender de nenhuma
// biblioteca externa, então funciona igual aqui no Claude e no site
// publicado, sem risco de quebrar a instalação.
function GraficoBarras({ series, altura = 180, formatarValor = money, onBarClick }) {
  const labels = series[0]?.dados.map((d) => d.label) || [];
  const max = Math.max(1, ...series.flatMap((s) => s.dados.map((d) => d.valor)));

  return (
    <div>
      {series.length > 1 && (
        <div style={{ display: "flex", gap: "16px", marginBottom: "10px", fontSize: "11.5px" }}>
          {series.map((s) => (
            <div key={s.nome} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "2px", background: s.cor, display: "inline-block" }} />
              <span style={{ color: "var(--text-muted)" }}>{s.nome}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: `${altura}px`, borderBottom: "1px solid var(--border-soft)", paddingBottom: "2px" }}>
        {labels.map((label, i) => {
          const Wrapper = onBarClick ? "button" : "div";
          return (
            <Wrapper
              key={label}
              type={onBarClick ? "button" : undefined}
              onClick={onBarClick ? () => onBarClick(label) : undefined}
              className={onBarClick ? "tl-focus" : undefined}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                minWidth: 0,
                background: "none",
                border: "none",
                padding: 0,
                cursor: onBarClick ? "pointer" : "default",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", width: "100%", justifyContent: "center", height: "100%" }}>
                {series.map((s) => {
                  const valor = s.dados[i]?.valor || 0;
                  const alturaBarra = max > 0 ? Math.max(valor > 0 ? 3 : 0, (valor / max) * (altura - 22)) : 0;
                  return (
                    <div key={s.nome} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", flex: 1, maxWidth: "26px" }} title={`${s.nome}: ${formatarValor(valor)}${onBarClick ? " — clique pra ver o fechamento" : ""}`}>
                      <div style={{ fontSize: "9px", color: "var(--text-faint)", marginBottom: "3px", whiteSpace: "nowrap" }}>
                        {valor > 0 ? formatarValor(valor) : ""}
                      </div>
                      <div style={{ width: "100%", height: `${alturaBarra}px`, background: s.cor, borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
                    </div>
                  );
                })}
              </div>
            </Wrapper>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
        {labels.map((label) => (
          <div key={label} style={{ flex: 1, textAlign: "center", fontSize: "10.5px", color: "var(--text-muted)" }}>{label}</div>
        ))}
      </div>
      {labels.length === 0 && (
        <p style={{ fontSize: "12.5px", color: "var(--text-faint)", textAlign: "center", padding: "30px 0" }}>Ainda não há dados suficientes pra montar o gráfico.</p>
      )}
    </div>
  );
}

function MiniStat({ label, valor, cor, onClick, ativo }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={onClick ? "tl-focus" : undefined}
      style={{
        background: ativo ? "var(--bg-panel-raised)" : "var(--bg-panel)",
        border: ativo ? "1px solid var(--amber)" : "1px solid var(--border-soft)",
        borderRadius: "9px",
        padding: "14px 16px",
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
        width: "100%",
      }}
    >
      <div className="tl-display" style={{ fontSize: "22px", fontWeight: 700, color: cor }}>{valor}</div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
    </Tag>
  );
}

function BoletoReader({ onDecoded }) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const cameraSuportada = typeof window !== "undefined" && "BarcodeDetector" in window;

  const aplicar = (raw) => {
    const resultado = decodificarBoleto(raw);
    if (!resultado) {
      setErro("Não reconheci esse número — confira se copiou os 44 ou 47 dígitos certinho.");
      setOk(false);
      return;
    }
    setErro("");
    setOk(true);
    onDecoded(resultado);
  };

  const pararCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const iniciarCamera = async () => {
    setErro("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const detector = new window.BarcodeDetector({ formats: ["itf", "code_128", "code_39"] });
      const loop = async () => {
        if (!streamRef.current || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            const valor = codes[0].rawValue.replace(/\D/g, "");
            setCodigo(valor);
            aplicar(valor);
            pararCamera();
            return;
          }
        } catch (e) {
          /* frame sem leitura, tenta de novo */
        }
        if (streamRef.current) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    } catch (e) {
      setErro("Não consegui acessar a câmera — verifique a permissão do navegador, ou digite o código manualmente.");
      pararCamera();
    }
  };

  useEffect(() => () => pararCamera(), []);

  return (
    <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "7px", padding: "12px 14px", marginBottom: "18px" }}>
      <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "8px" }}>
        Ler boleto (opcional)
      </div>

      {scanning && (
        <div style={{ marginBottom: "10px" }}>
          <video ref={videoRef} muted playsInline style={{ width: "100%", borderRadius: "6px", background: "#000" }} />
          <Button type="button" size="sm" variant="ghost" onClick={pararCamera} style={{ marginTop: "6px" }}>Cancelar câmera</Button>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Input
          placeholder="Cole aqui a linha digitável ou código de barras"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{ flex: 1, minWidth: "220px" }}
        />
        <Button type="button" variant="subtle" onClick={() => aplicar(codigo)}>Preencher valor e vencimento</Button>
        {cameraSuportada && !scanning && (
          <Button type="button" variant="subtle" icon={Camera} onClick={iniciarCamera}>Usar câmera</Button>
        )}
      </div>

      {erro && <p style={{ fontSize: "12px", color: "var(--danger)", marginTop: "8px" }}>{erro}</p>}
      {ok && !erro && <p style={{ fontSize: "12px", color: "var(--success)", marginTop: "8px" }}>Valor e vencimento preenchidos abaixo — confira antes de salvar.</p>}
      {!cameraSuportada && (
        <p style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "6px" }}>
          Esse navegador não suporta leitura por câmera — cole o número do boleto no campo acima.
        </p>
      )}
    </div>
  );
}

function ContaForm({ initial, clienteByPedido, contas, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const [erroValidacao, setErroValidacao] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isReceber = form.tipo === "Receber";
  const matched = isReceber && form.pedido ? clienteByPedido.get(String(form.pedido).trim()) : null;
  const ehPago = form.status === "Pago";
  const valorTotal = numeroSeguro(form.valor);
  const valorPago = form.valorPago !== "" ? numeroSeguro(form.valorPago) : (ehPago ? valorTotal : 0);
  const restante = Math.max(0, valorTotal - valorPago);
  const pagamentoParcial = (ehPago || form.status === "Pendente") && restante > 0.005 && valorPago > 0.005;

  // Soma de TODOS os lançamentos desse mesmo pedido (não só o que está sendo
  // editado agora) — pra ver de cara o total do pedido inteiro sem precisar
  // fechar o formulário e ir procurar na tela de busca.
  const resumoDoPedido = useMemo(() => {
    if (!isReceber || !form.pedido || !form.pedido.trim()) return null;
    const alvo = form.pedido.trim();
    const doPedido = (contas || []).filter((c) => c.tipo === "Receber" && String(c.pedido || "").trim() === alvo);
    if (doPedido.length === 0) return null;
    const totalPedido = doPedido.reduce((s, c) => s + numeroSeguro(c.valor), 0);
    return { qtd: doPedido.length, totalPedido };
  }, [contas, isReceber, form.pedido]);

  useEffect(() => {
    salvarRascunho("conta", form);
  }, [form]);

  // Preenche a data de pagamento automaticamente quando marca como Pago —
  // isso é seguro (não depende de outro campo mudar depois). O "valor
  // pago" NÃO é travado aqui: o cálculo abaixo já usa o valor total atual
  // sempre que o campo estiver vazio, então nunca fica desatualizado.
  useEffect(() => {
    if (ehPago && !form.dataPagamento) {
      setForm((f) => ({ ...f, dataPagamento: new Date().toISOString().slice(0, 10) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ehPago]);

  const validarEEnviar = (e) => {
    e.preventDefault();
    if (ehPago && !form.formaPagamento.trim()) {
      setErroValidacao("Pra marcar como Pago, é obrigatório preencher a forma de pagamento (PIX, boleto, dinheiro, etc).");
      return;
    }
    if (pagamentoParcial && !form.dataProximoPagamento) {
      setErroValidacao("Como o pagamento foi parcial, preencha a data prevista pro próximo pagamento do restante.");
      return;
    }
    setErroValidacao("");
    limparRascunho("conta");
    // Se "valor pago" ficou em branco, salva com o valor total atual
    // (pagamento integral) — nunca grava vazio.
    onSave(ehPago && form.valorPago === "" ? { ...form, valorPago: valorTotal } : form);
  };

  return (
    <Modal title={initial.descricao ? "Editar conta" : `Nova conta ${isReceber ? "a receber" : "a pagar"}`} onClose={() => { limparRascunho("conta"); onClose(); }} wide>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form onSubmit={validarEEnviar}>
        {!isReceber && (
          <BoletoReader
            onDecoded={({ valor, vencimento }) => {
              setForm((f) => ({ ...f, valor: valor || f.valor, vencimento: vencimento || f.vencimento }));
            }}
          />
        )}

        <Field label="Descrição" required>
          <Input value={form.descricao} onChange={set("descricao")} required placeholder={isReceber ? "Ex: Locação escavadeira - pedido 620" : "Ex: Diesel posto Ipiranga"} />
        </Field>

        {isReceber ? (
          <Field label="Nº do pedido" hint="Opcional — puxa o cliente automaticamente">
            <Input value={form.pedido} onChange={set("pedido")} />
          </Field>
        ) : (
          <Field label="Fornecedor">
            <Input value={form.fornecedor} onChange={set("fornecedor")} />
          </Field>
        )}

        {isReceber && form.pedido && (
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "9px 12px", marginBottom: "16px", fontSize: "13px" }}>
            {matched ? (
              <>
                <span style={{ fontWeight: 600 }}>{matched.nome}</span>
                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>{enderecoCompleto(matched) || "Endereço não cadastrado"}</div>
              </>
            ) : (
              <span style={{ color: "var(--text-faint)" }}>Nenhum cliente cadastrado com esse pedido</span>
            )}
          </div>
        )}

        {resumoDoPedido && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-panel)", border: "1px solid var(--accent)", borderRadius: "6px", padding: "9px 12px", marginBottom: "16px", fontSize: "12.5px" }}>
            <span style={{ color: "var(--text-muted)" }}>
              Soma de todo o pedido #{form.pedido.trim()} ({resumoDoPedido.qtd} lançamento{resumoDoPedido.qtd === 1 ? "" : "s"})
            </span>
            <strong className="tl-mono" style={{ fontSize: "14px" }}>{money(resumoDoPedido.totalPedido)}</strong>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Valor (R$)" required>
            <Input type="number" min="0" step="0.01" value={form.valor} onChange={set("valor")} required />
          </Field>
          <Field label="Vencimento">
            <Input type="date" value={form.vencimento} onChange={set("vencimento")} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              <option>Pendente</option>
              <option>Boleto</option>
              <option>Pago</option>
              <option>Cancelado</option>
            </Select>
          </Field>
          <Field label="Data de pagamento" hint="Se já foi pago">
            <Input type="date" value={form.dataPagamento} onChange={set("dataPagamento")} />
          </Field>
        </div>

        <Field label={`Forma de pagamento${ehPago ? " *" : ""}`} hint={ehPago ? "Obrigatório quando o status é Pago" : undefined}>
          <Input value={form.formaPagamento} onChange={set("formaPagamento")} placeholder="Ex: PIX, boleto, dinheiro" required={ehPago} />
        </Field>

        {(ehPago || form.status === "Pendente") && (
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px" }}>
            {form.status === "Pendente" && (
              <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginTop: 0, marginBottom: "10px" }}>
                Já recebeu uma parte mas ainda não fechou o pedido? Preenche "Valor pago" abaixo sem mudar o status pra Pago.
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Valor pago (R$)" hint="Deixa em branco se pagou o valor total inteiro">
                <Input type="number" min="0" step="0.01" value={form.valorPago} onChange={set("valorPago")} placeholder={money(valorTotal)} />
              </Field>
              <Field label="Falta pagar (calculado sozinho)">
                <div style={{ padding: "9px 12px", background: "var(--bg-panel-raised)", borderRadius: "6px", fontSize: "14px", fontWeight: 700, color: restante > 0.005 ? "var(--danger)" : "var(--success)" }} className="tl-mono">
                  {money(restante)}
                </div>
              </Field>
            </div>
            {pagamentoParcial && (
              <Field label="Data prevista pro próximo pagamento *" hint="Obrigatório porque ficou faltando pagar uma parte">
                <Input type="date" value={form.dataProximoPagamento} onChange={set("dataProximoPagamento")} required />
              </Field>
            )}
          </div>
        )}

        {erroValidacao && (
          <div style={{ background: "#3A1E1E", border: "1px solid #5a3030", color: "#D6706F", borderRadius: "6px", padding: "10px 12px", fontSize: "12.5px", marginBottom: "14px" }}>
            {erroValidacao}
          </div>
        )}

        <Field label="Observação">
          <TextArea value={form.observacao} onChange={set("observacao")} />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("conta"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar conta</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Financeiro — Relatório diário/semanal/mensal                        */
/* ------------------------------------------------------------------ */
function isoWeekKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNr = 1 + Math.round(((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
  return `${target.getFullYear()}-S${String(weekNr).padStart(2, "0")}`;
}

function FinanceiroRelatorio({ contas, producaoEsc, producaoPerf, onVerPedido }) {
  const [periodo, setPeriodo] = useState("diario"); // diario | semanal | mensal
  const [verPeriodo, setVerPeriodo] = useState(null); // { chave, contas }

  const chaveDe = (dataStr) => {
    const normalizada = dataOrdenavel(dataStr);
    if (!normalizada) return null;
    if (periodo === "diario") return normalizada;
    if (periodo === "semanal") return isoWeekKey(normalizada);
    return normalizada.slice(0, 7); // AAAA-MM
  };

  const buckets = useMemo(() => {
    const map = new Map();
    contas.forEach((c) => {
      if (c.status !== "Pago" || !c.dataPagamento) return;
      const chave = chaveDe(c.dataPagamento);
      if (!chave) return;
      if (!map.has(chave)) map.set(chave, { recebido: 0, pago: 0, contas: [] });
      const acc = map.get(chave);
      if (c.tipo === "Receber") acc.recebido += numeroSeguro(c.valor);
      else acc.pago += numeroSeguro(c.valor);
      acc.contas.push(c);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 20);
  }, [contas, periodo]);

  const totalRecebido = contas.filter((c) => c.tipo === "Receber" && c.status === "Pago").reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const totalPago = contas.filter((c) => c.tipo === "Pagar" && c.status === "Pago").reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const totalAReceber = contas.filter((c) => c.tipo === "Receber" && c.status !== "Pago" && c.status !== "Cancelado").reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const totalAPagar = contas.filter((c) => c.tipo === "Pagar" && c.status !== "Pago" && c.status !== "Cancelado").reduce((s, c) => s + numeroSeguro(c.valor), 0);

  const abertosReceber = useMemo(
    () =>
      contas
        .filter((c) => c.tipo === "Receber" && c.status !== "Pago" && c.status !== "Cancelado")
        .sort((a, b) => dataOrdenavel(a.vencimento).localeCompare(dataOrdenavel(b.vencimento))),
    [contas]
  );
  // Pedidos ÚNICOS em aberto — um mesmo pedido pode ter várias contas (uma
  // por lançamento de produção), e isso não deve contar como vários pedidos.
  const pedidosUnicosAbertos = new Set(abertosReceber.filter((c) => c.pedido).map((c) => String(c.pedido).trim())).size;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "22px" }}>
        <MiniStat label="Recebido (contas)" valor={money(totalRecebido)} cor="var(--success)" />
        <MiniStat label="Pago" valor={money(totalPago)} cor="var(--danger)" />
        <MiniStat label="Saldo" valor={money(totalRecebido - totalPago)} cor="var(--amber)" />
        <MiniStat label="A receber (contas)" valor={money(totalAReceber)} cor="var(--text-primary)" />
        <MiniStat label="A pagar" valor={money(totalAPagar)} cor="var(--text-primary)" />
      </div>

      <div style={{ marginBottom: "26px" }}>
        <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>
          Pedidos ainda em aberto pra receber ({pedidosUnicosAbertos})
        </h4>
        {abertosReceber.length === 0 ? (
          <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nenhuma conta a receber em aberto — tudo recebido!</p>
        ) : (
          <Table
            columns={["Pedido", "Descrição / Cliente", "Vencimento", "Status", "Valor pago", "Falta", "Valor"]}
            rows={abertosReceber.map((c) => {
              const valorPagoConta = c.valorPago !== "" && c.valorPago !== undefined ? numeroSeguro(c.valorPago) : 0;
              const faltaConta = Math.max(0, numeroSeguro(c.valor) - valorPagoConta);
              return (
              <tr key={c.id} style={rowStyle}>
                <td style={tdStyle}>
                  {c.pedido ? (
                    <button onClick={() => onVerPedido(String(c.pedido).trim())} className="tl-focus" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} title="Ver relatório geral desse pedido">
                      <PedidoStub n={c.pedido} />
                    </button>
                  ) : (
                    <span style={{ color: "var(--text-faint)" }}>-</span>
                  )}
                </td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{c.descricao || c.fornecedor || "-"}</td>
                <td style={{ ...tdStyle, color: dataOrdenavel(c.vencimento) < dataOrdenavel(new Date().toISOString().slice(0, 10)) ? "var(--danger)" : "var(--text-muted)" }}>
                  {fmtDate(c.vencimento)}
                </td>
                <td style={tdStyle}><StatusBadge status={c.status} /></td>
                <td style={{ ...tdStyle, color: valorPagoConta > 0 ? "var(--success)" : "var(--text-faint)" }} className="tl-mono">{valorPagoConta > 0 ? money(valorPagoConta) : "-"}</td>
                <td style={{ ...tdStyle, color: "var(--danger)", fontWeight: 600 }} className="tl-mono">{money(faltaConta)}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(numeroSeguro(c.valor))}</td>
              </tr>
              );
            })}
          />
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { id: "diario", label: "Diário" },
          { id: "semanal", label: "Semanal" },
          { id: "mensal", label: "Mensal" },
        ].map((p) => (
          <Button key={p.id} size="sm" variant={periodo === p.id ? "primary" : "subtle"} onClick={() => setPeriodo(p.id)} type="button">
            {p.label}
          </Button>
        ))}
      </div>

      {buckets.length === 0 ? (
        <EmptyState icon={BarChart2} title="Sem contas pagas/recebidas ainda" hint="O relatório aparece assim que houver contas marcadas como pagas, com data de pagamento." />
      ) : (
        <>
          <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "18px", marginBottom: "20px" }}>
            <GraficoBarras
              series={[
                { nome: "Recebido", cor: "var(--success)", dados: [...buckets].reverse().map(([chave, acc]) => ({ label: chave, valor: acc.recebido })) },
                { nome: "Pago", cor: "var(--danger)", dados: [...buckets].reverse().map(([chave, acc]) => ({ label: chave, valor: acc.pago })) },
              ]}
              onBarClick={(chave) => {
                const bucket = buckets.find(([c]) => c === chave);
                if (bucket) setVerPeriodo({ chave, ...bucket[1] });
              }}
            />
          </div>
          <Table
          columns={["Período", "Recebido", "Pago", "Saldo"]}
          rows={buckets.map(([chave, acc]) => (
            <tr key={chave} style={rowStyle}>
              <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{chave}</td>
              <td style={tdStyle} className="tl-mono">{money(acc.recebido)}</td>
              <td style={tdStyle} className="tl-mono">{money(acc.pago)}</td>
              <td style={{ ...tdStyle, color: acc.recebido - acc.pago >= 0 ? "var(--success)" : "var(--danger)" }} className="tl-mono">
                {money(acc.recebido - acc.pago)}
              </td>
            </tr>
          ))}
          />
        </>
      )}
      {verPeriodo && <DetalhePeriodoFinanceiro periodo={verPeriodo} onClose={() => setVerPeriodo(null)} />}
    </div>
  );
}

function DetalhePeriodoFinanceiro({ periodo, onClose }) {
  const recebidas = periodo.contas.filter((c) => c.tipo === "Receber");
  const pagas = periodo.contas.filter((c) => c.tipo === "Pagar");

  return (
    <Modal title={`Movimentação — ${periodo.chave}`} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
        <MiniStat label="Recebido" valor={money(periodo.recebido)} cor="var(--success)" />
        <MiniStat label="Pago" valor={money(periodo.pago)} cor="var(--danger)" />
      </div>

      {recebidas.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            Recebido ({recebidas.length})
          </h4>
          {recebidas.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "13px" }}>
              <span>{c.fornecedor || c.descricao || "-"}{c.pedido && <span style={{ color: "var(--text-faint)" }}> · #{c.pedido}</span>}</span>
              <strong className="tl-mono" style={{ color: "var(--success)" }}>{money(c.valor)}</strong>
            </div>
          ))}
        </div>
      )}

      {pagas.length > 0 && (
        <div>
          <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            Pago ({pagas.length})
          </h4>
          {pagas.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "13px" }}>
              <span>{c.fornecedor || c.descricao || "-"}{c.pedido && <span style={{ color: "var(--text-faint)" }}> · #{c.pedido}</span>}</span>
              <strong className="tl-mono" style={{ color: "var(--danger)" }}>{money(c.valor)}</strong>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Calculadora de Caminhões (empolamento)                              */
/* ------------------------------------------------------------------ */
// Cada elemento estrutural (laje, viga, pilar, sapata, etc) com sua fórmula
// de volume — a maioria é só comprimento × largura × altura, mas fica
// separado por nome pra facilitar quem está montando a lista de uma obra.
const TIPOS_ELEMENTO_CONCRETO = ["Laje", "Viga", "Pilar", "Sapata", "Fundação/Radier", "Contrapiso", "Outro"];

const emptyElementoConcreto = () => ({ id: uid(), tipo: "Laje", descricao: "", comprimento: "", largura: "", altura: "", quantidade: 1 });

// Materiais agregados usados na usina — compartilhado entre Compra e Estoque.
const MATERIAIS_AGREGADOS = ["Cimento", "Areia", "Pedra 1", "Pedrisco", "Areia Fina", "Aditivo", "Diesel"];
const UNIDADE_POR_MATERIAL = { Cimento: "t", Areia: "t", "Pedra 1": "t", Pedrisco: "t", "Areia Fina": "t", Aditivo: "L", Diesel: "L" };
// Diesel não entra no controle de estoque (é abastecimento de veículo, não
// insumo de concreto) — os outros 6 aparecem na tela de Estoque.
const MATERIAIS_ESTOCADOS = MATERIAIS_AGREGADOS.filter((m) => m !== "Diesel");

// Carta traço — a "receita" de quanto de cada material entra em 1m³ de
// concreto, por FCK. Cimento/areia/pedra/pedrisco/areia fina em kg por m³
// (convertidos pra tonelada na hora de abater do estoque); aditivo em
// litros por m³ (já a unidade usada no estoque).
const emptyCartaTraco = () => ({
  id: uid(),
  fck: "",
  cimento: "", // kg/m³
  areia: "", // kg/m³
  pedra1: "", // kg/m³
  pedrisco: "", // kg/m³
  areiaFina: "", // kg/m³
  aditivo: "", // L/m³
});

// Calcula quanto de cada material um volume (m³) consome, segundo a carta
// traço daquele FCK. Retorna null se não existir traço cadastrado pra esse
// FCK (nesse caso, não há como abater o estoque automaticamente).
function calcularConsumoMateriais(cartaTraco, fck, volumeM3) {
  const traco = (cartaTraco || []).find((t) => (t.fck || "").trim().toLowerCase() === (fck || "").trim().toLowerCase());
  if (!traco || !volumeM3) return null;
  const kgParaTon = (kgPorM3) => ((Number(kgPorM3) || 0) * volumeM3) / 1000;
  return {
    Cimento: kgParaTon(traco.cimento),
    Areia: kgParaTon(traco.areia),
    "Pedra 1": kgParaTon(traco.pedra1),
    Pedrisco: kgParaTon(traco.pedrisco),
    "Areia Fina": kgParaTon(traco.areiaFina),
    Aditivo: ((Number(traco.aditivo) || 0) * volumeM3), // já em litros
  };
}

function CartaTracoModule({ cartaTraco, onChange }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const salvar = (item) => {
    const existe = cartaTraco.some((t) => t.id === item.id);
    onChange(existe ? cartaTraco.map((t) => (t.id === item.id ? item : t)) : [...cartaTraco, item]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(cartaTraco.filter((t) => t.id !== id));
    setDeleting(null);
  };

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Insumos"
        title="Carta Traço"
        action={<Button icon={Plus} onClick={() => setEditing(emptyCartaTraco())}>Novo traço</Button>}
      />
      <p style={{ fontSize: "12.5px", color: "var(--text-faint)", marginBottom: "18px", maxWidth: "620px" }}>
        Cadastra aqui quanto de cada material entra em 1m³ de concreto, por FCK. Assim que uma carga com esse FCK for lançada na Central de Balança com o volume preenchido, o sistema já abate sozinho a quantidade correspondente do Estoque de Materiais.
      </p>
      {cartaTraco.length === 0 ? (
        <EmptyState icon={Beaker} title="Nenhuma carta traço cadastrada ainda" hint="Sem isso, o sistema não consegue abater o estoque sozinho quando uma carga sai." />
      ) : (
        <Table
          columns={["FCK", "Cimento (kg/m³)", "Areia (kg/m³)", "Pedra 1 (kg/m³)", "Pedrisco (kg/m³)", "Areia Fina (kg/m³)", "Aditivo (L/m³)", ""]}
          rows={cartaTraco.map((t) => (
            <tr key={t.id} style={rowStyle}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{t.fck}</td>
              <td style={tdStyle} className="tl-mono">{t.cimento || "-"}</td>
              <td style={tdStyle} className="tl-mono">{t.areia || "-"}</td>
              <td style={tdStyle} className="tl-mono">{t.pedra1 || "-"}</td>
              <td style={tdStyle} className="tl-mono">{t.pedrisco || "-"}</td>
              <td style={tdStyle} className="tl-mono">{t.areiaFina || "-"}</td>
              <td style={tdStyle} className="tl-mono">{t.aditivo || "-"}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <RowActions onEdit={() => setEditing(t)} onDelete={() => setDeleting(t)} />
              </td>
            </tr>
          ))}
        />
      )}
      {editing && (
        <Modal title={editing.fck ? "Editar traço" : "Novo traço"} onClose={() => setEditing(null)}>
          <form onSubmit={(e) => { e.preventDefault(); salvar(editing); }}>
            <Field label="FCK" hint='Precisa ser igual ao texto usado em Produção (ex: "FCK 25")'>
              <Input value={editing.fck} onChange={(e) => setEditing({ ...editing, fck: e.target.value })} required />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Cimento (kg/m³)">
                <Input type="number" min="0" step="0.1" value={editing.cimento} onChange={(e) => setEditing({ ...editing, cimento: e.target.value })} />
              </Field>
              <Field label="Areia (kg/m³)">
                <Input type="number" min="0" step="0.1" value={editing.areia} onChange={(e) => setEditing({ ...editing, areia: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Pedra 1 (kg/m³)">
                <Input type="number" min="0" step="0.1" value={editing.pedra1} onChange={(e) => setEditing({ ...editing, pedra1: e.target.value })} />
              </Field>
              <Field label="Pedrisco (kg/m³)">
                <Input type="number" min="0" step="0.1" value={editing.pedrisco} onChange={(e) => setEditing({ ...editing, pedrisco: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Areia Fina (kg/m³)">
                <Input type="number" min="0" step="0.1" value={editing.areiaFina} onChange={(e) => setEditing({ ...editing, areiaFina: e.target.value })} />
              </Field>
              <Field label="Aditivo (L/m³)">
                <Input type="number" min="0" step="0.01" value={editing.aditivo} onChange={(e) => setEditing({ ...editing, aditivo: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete label={`o traço do "${deleting.fck}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

const emptyRegistroDiesel = () => ({
  id: uid(),
  data: new Date().toISOString().slice(0, 10),
  placa: "",
  motorista: "",
  kmAtual: "",
  litros: "",
  valorLitro: "",
});

// Calcula o consumo (km/L) de cada abastecimento comparando com o anterior
// da MESMA placa — precisa da lista já ordenada por data crescente.
function calcularConsumoDiesel(registros) {
  const porPlaca = {};
  const ordenados = [...registros].sort((a, b) => dataOrdenavel(a.data).localeCompare(dataOrdenavel(b.data)));
  return ordenados.map((r) => {
    const anterior = porPlaca[r.placa];
    let consumo = null;
    if (anterior && numeroSeguro(r.kmAtual) > numeroSeguro(anterior.kmAtual) && numeroSeguro(r.litros) > 0) {
      consumo = (numeroSeguro(r.kmAtual) - numeroSeguro(anterior.kmAtual)) / numeroSeguro(r.litros);
    }
    porPlaca[r.placa] = r;
    return { ...r, consumoKmL: consumo };
  });
}

function DieselModule({ registros, onChange }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const salvar = (item) => {
    const existe = registros.some((r) => r.id === item.id);
    onChange(existe ? registros.map((r) => (r.id === item.id ? item : r)) : [...registros, item]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(registros.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const comConsumo = useMemo(() => calcularConsumoDiesel(registros), [registros]);
  const porData = [...comConsumo].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data)));
  const totalLitros = registros.reduce((s, r) => s + numeroSeguro(r.litros), 0);
  const totalValor = registros.reduce((s, r) => s + numeroSeguro(r.litros) * numeroSeguro(r.valorLitro), 0);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Frota"
        title="Diesel"
        action={<Button icon={Plus} onClick={() => setEditing(emptyRegistroDiesel())}>Novo abastecimento</Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px", maxWidth: "460px" }}>
        <MiniStat label="Total abastecido" valor={`${totalLitros.toFixed(1)} L`} />
        <MiniStat label="Total gasto" valor={money(totalValor)} />
      </div>
      {porData.length === 0 ? (
        <EmptyState icon={Fuel} title="Nenhum abastecimento registrado ainda" />
      ) : (
        <Table
          columns={["Data", "Placa", "Motorista", "Km atual", "Litros", "Valor/L", "Consumo (km/L)", ""]}
          rows={porData.map((r) => (
            <tr key={r.id} style={rowStyle}>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{r.placa}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.motorista || "-"}</td>
              <td style={tdStyle} className="tl-mono">{r.kmAtual || "-"}</td>
              <td style={tdStyle} className="tl-mono">{r.litros || "-"} L</td>
              <td style={tdStyle} className="tl-mono">{money(r.valorLitro)}</td>
              <td style={tdStyle} className="tl-mono">{r.consumoKmL != null ? `${r.consumoKmL.toFixed(2)} km/L` : "-"}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <RowActions onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />
              </td>
            </tr>
          ))}
        />
      )}
      {editing && (
        <Modal title={editing.placa ? "Editar abastecimento" : "Novo abastecimento"} onClose={() => setEditing(null)}>
          <form onSubmit={(e) => { e.preventDefault(); salvar(editing); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Data">
                <Input type="date" value={editing.data} onChange={(e) => setEditing({ ...editing, data: e.target.value })} />
              </Field>
              <Field label="Placa">
                <Input value={editing.placa} onChange={(e) => setEditing({ ...editing, placa: e.target.value })} required />
              </Field>
            </div>
            <Field label="Motorista">
              <Input value={editing.motorista} onChange={(e) => setEditing({ ...editing, motorista: e.target.value })} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Km atual (odômetro)">
                <Input type="number" min="0" step="1" value={editing.kmAtual} onChange={(e) => setEditing({ ...editing, kmAtual: e.target.value })} />
              </Field>
              <Field label="Litros abastecidos">
                <Input type="number" min="0" step="0.1" value={editing.litros} onChange={(e) => setEditing({ ...editing, litros: e.target.value })} />
              </Field>
            </div>
            <Field label="Valor por litro (R$)">
              <Input type="number" min="0" step="0.01" value={editing.valorLitro} onChange={(e) => setEditing({ ...editing, valorLitro: e.target.value })} />
            </Field>
            <p style={{ fontSize: "11px", color: "var(--text-faint)", marginBottom: "16px" }}>
              O consumo (km/L) é calculado sozinho, comparando com o km do abastecimento anterior dessa mesma placa.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete label={`o abastecimento de "${deleting.placa}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bombas (equipamento)                                              */
/* ------------------------------------------------------------------ */

const STATUS_BOMBA = ["Disponível", "Agendada", "Em operação", "Em manutenção", "Indisponível"];
const STATUS_BOMBA_STYLES = {
  "Disponível": { bg: "#1F3D2A", fg: "#7BC492" },
  "Agendada": { bg: "#2C3F55", fg: "#8CBCE8" },
  "Em operação": { bg: "#3D2B54", fg: "#CBA6F2" },
  "Em manutenção": { bg: "#52431D", fg: "#F0B958" },
  "Indisponível": { bg: "#532B2B", fg: "#E88886" },
};

function BadgeBomba({ status }) {
  const s = STATUS_BOMBA_STYLES[status] || { bg: "#363D49", fg: "#AEB5C2" };
  return <span style={{ background: s.bg, color: s.fg, padding: "2px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>{status}</span>;
}

const emptyBomba = () => ({
  id: uid(),
  codigo: "",
  marca: "",
  modelo: "",
  ano: "",
  tipo: "Lança", // Lança | Estacionária | Outra
  alcance: "",
  capacidade: "",
  horimetro: "",
  status: "Disponível",
  valorDiaria: "",
  valorHora: "",
  valorMinimo: "",
  observacao: "",
});

// Dashboard específico do negócio de locação de bombas — cards do dia a dia
// e uma lista de alertas montada sozinha a partir dos dados reais.
// Função utilitária: baixa uma lista de objetos como CSV (abre direto no Excel).
function exportarCSV(nomeArquivo, linhas, colunas) {
  const header = colunas.map((c) => c.label).join(";");
  const corpo = linhas.map((linha) => colunas.map((c) => String(c.get(linha) ?? "").replace(/;/g, ",")).join(";")).join("\n");
  const csv = "\uFEFF" + header + "\n" + corpo;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nomeArquivo}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const RELATORIOS_BOMBAS = [
  "Serviços realizados",
  "Serviços agendados",
  "Propostas",
  "Clientes",
  "Faturamento",
  "Contas a receber",
  "Contas a pagar",
  "Inadimplência",
  "Utilização das bombas",
  "Manutenção dos equipamentos",
  "Comissão de vendedores",
];

// Estoque de peças e materiais (óleo, filtros, mangueiras, graxa, etc.) —
// mesmo princípio do estoque de agregados: cada movimento soma ou desconta
// do saldo, calculado sozinho a partir do histórico.
const emptyPeca = () => ({ id: uid(), nome: "", unidade: "un", estoqueMinimo: "" });

const emptyMovimentoPeca = () => ({
  id: uid(),
  pecaId: "",
  tipo: "Entrada", // Entrada | Saída
  quantidade: "",
  data: new Date().toISOString().slice(0, 10),
  motivo: "",
  bombaId: "", // qual bomba recebeu a peça, se for saída pra manutenção
});

function EstoquePecasModule({ pecas, movimentos, bombas, onChangePecas, onChangeMovimentos }) {
  const [editingPeca, setEditingPeca] = useState(null);
  const [editingMov, setEditingMov] = useState(null);
  const [deletingPeca, setDeletingPeca] = useState(null);

  const saldoPorPeca = useMemo(() => {
    const mapa = {};
    pecas.forEach((p) => (mapa[p.id] = 0));
    movimentos.forEach((m) => {
      if (!(m.pecaId in mapa)) return;
      mapa[m.pecaId] += m.tipo === "Entrada" ? Number(m.quantidade) || 0 : -(Number(m.quantidade) || 0);
    });
    return mapa;
  }, [pecas, movimentos]);

  const salvarPeca = (p) => {
    const existe = pecas.some((it) => it.id === p.id);
    onChangePecas(existe ? pecas.map((it) => (it.id === p.id ? p : it)) : [...pecas, p]);
    setEditingPeca(null);
  };
  const removerPeca = (id) => {
    onChangePecas(pecas.filter((p) => p.id !== id));
    onChangeMovimentos(movimentos.filter((m) => m.pecaId !== id));
    setDeletingPeca(null);
  };
  const salvarMovimento = (m) => {
    onChangeMovimentos([...movimentos, m]);
    setEditingMov(null);
  };

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Insumos"
        title="Estoque de Peças e Materiais"
        action={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="subtle" icon={Plus} onClick={() => setEditingPeca(emptyPeca())}>Novo item</Button>
            <Button icon={Plus} onClick={() => setEditingMov(emptyMovimentoPeca())} disabled={pecas.length === 0}>Movimentar</Button>
          </div>
        }
      />
      {pecas.length === 0 ? (
        <EmptyState icon={Boxes} title="Nenhum item cadastrado ainda" hint='Cadastra peças como óleo, filtros, mangueiras... clicando em "Novo item".' />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "26px" }}>
          {pecas.map((p) => {
            const saldo = saldoPorPeca[p.id] || 0;
            const baixo = p.estoqueMinimo && saldo < Number(p.estoqueMinimo);
            return (
              <div key={p.id} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{p.nome}</div>
                  <RowActions onEdit={() => setEditingPeca(p)} onDelete={() => setDeletingPeca(p)} />
                </div>
                <div className="tl-display" style={{ fontSize: "22px", fontWeight: 800, color: baixo ? "var(--danger)" : "var(--text-primary)" }}>
                  {saldo} <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-faint)" }}>{p.unidade}</span>
                </div>
                {baixo && <div style={{ fontSize: "10.5px", color: "var(--danger)", marginTop: "4px" }}>Abaixo do mínimo ({p.estoqueMinimo})</div>}
              </div>
            );
          })}
        </div>
      )}

      <h4 className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Histórico de movimentos</h4>
      {movimentos.length === 0 ? (
        <EmptyState icon={Boxes} title="Nenhum movimento ainda" />
      ) : (
        <Table
          columns={["Data", "Item", "Tipo", "Quantidade", "Bomba", "Motivo", ""]}
          rows={[...movimentos].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data))).slice(0, 100).map((m) => (
            <tr key={m.id} style={rowStyle}>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(m.data)}</td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{pecas.find((p) => p.id === m.pecaId)?.nome || "-"}</td>
              <td style={tdStyle}>
                <span className="tl-mono" style={{ fontSize: "11px", fontWeight: 700, color: m.tipo === "Entrada" ? "var(--success)" : "var(--danger)" }}>{m.tipo === "Entrada" ? "▲ ENTRADA" : "▼ SAÍDA"}</span>
              </td>
              <td style={tdStyle} className="tl-mono">{m.quantidade}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{bombas.find((b) => b.id === m.bombaId)?.codigo || "-"}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{m.motivo || "-"}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <button type="button" onClick={() => onChangeMovimentos(movimentos.filter((it) => it.id !== m.id))} className="tl-focus" style={{ ...iconBtnStyle, color: "var(--danger)" }} title="Excluir (devolve o valor pro estoque)">
                  <X size={13} />
                </button>
              </td>
            </tr>
          ))}
        />
      )}

      {editingPeca && (
        <Modal title={editingPeca.nome ? "Editar item" : "Novo item"} onClose={() => setEditingPeca(null)}>
          <form onSubmit={(e) => { e.preventDefault(); salvarPeca(editingPeca); }}>
            <Field label="Nome do item" required>
              <Input value={editingPeca.nome} onChange={(e) => setEditingPeca({ ...editingPeca, nome: e.target.value })} placeholder="Ex: Óleo hidráulico 20L" required />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Unidade">
                <Input value={editingPeca.unidade} onChange={(e) => setEditingPeca({ ...editingPeca, unidade: e.target.value })} placeholder="un, L, kg..." />
              </Field>
              <Field label="Estoque mínimo" hint="Avisa quando o saldo ficar abaixo disso">
                <Input type="number" min="0" value={editingPeca.estoqueMinimo} onChange={(e) => setEditingPeca({ ...editingPeca, estoqueMinimo: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditingPeca(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {editingMov && (
        <Modal title="Movimentar estoque" onClose={() => setEditingMov(null)}>
          <form onSubmit={(e) => { e.preventDefault(); salvarMovimento(editingMov); }}>
            <Field label="Item" required>
              <Select value={editingMov.pecaId} onChange={(e) => setEditingMov({ ...editingMov, pecaId: e.target.value })} required>
                <option value="">Selecione...</option>
                {pecas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </Select>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Tipo">
                <Select value={editingMov.tipo} onChange={(e) => setEditingMov({ ...editingMov, tipo: e.target.value })}>
                  <option>Entrada</option>
                  <option>Saída</option>
                </Select>
              </Field>
              <Field label="Quantidade">
                <Input type="number" min="0" step="0.1" value={editingMov.quantidade} onChange={(e) => setEditingMov({ ...editingMov, quantidade: e.target.value })} required />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Data">
                <Input type="date" value={editingMov.data} onChange={(e) => setEditingMov({ ...editingMov, data: e.target.value })} />
              </Field>
              <Field label="Bomba (se for pra manutenção)">
                <Select value={editingMov.bombaId} onChange={(e) => setEditingMov({ ...editingMov, bombaId: e.target.value })}>
                  <option value="">-</option>
                  {bombas.map((b) => <option key={b.id} value={b.id}>{b.codigo}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Motivo">
              <Input value={editingMov.motivo} onChange={(e) => setEditingMov({ ...editingMov, motivo: e.target.value })} />
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditingMov(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {deletingPeca && (
        <ConfirmDelete label={`o item "${deletingPeca.nome}"`} dados={deletingPeca} onConfirm={() => removerPeca(deletingPeca.id)} onCancel={() => setDeletingPeca(null)} />
      )}
    </div>
  );
}

function RelatoriosBombasModule({ clientes, bombas, agendamentos, ordensServico, propostas, financeiro, despesas, manutencoes, vendedores }) {
  const [relatorio, setRelatorio] = useState(RELATORIOS_BOMBAS[0]);
  const [dataIni, setDataIni] = useState("");
  const [dataFim, setDataFim] = useState("");

  const clienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "-";
  const bombaNome = (id) => bombas.find((b) => b.id === id)?.codigo || "-";
  const noPeriodo = (data) => (!dataIni || data >= dataIni) && (!dataFim || data <= dataFim);

  const dados = useMemo(() => {
    switch (relatorio) {
      case "Serviços realizados":
        return ordensServico.filter((o) => o.status === "Finalizada" && noPeriodo(o.data)).map((o) => ({
          data: fmtDate(o.data), cliente: clienteNome(o.clienteId), obra: o.obraTexto || "-", bomba: bombaNome(o.bombaId), volume: o.quantidadeRealizada || "-", valor: money(o.valor),
        }));
      case "Serviços agendados":
        return agendamentos.filter((a) => a.status !== "Cancelado" && noPeriodo(a.data)).map((a) => ({
          data: fmtDate(a.data), horario: a.horarioInicio || "-", cliente: clienteNome(a.clienteId), obra: a.obraTexto || "-", bomba: bombaNome(a.bombaId), status: a.status,
        }));
      case "Propostas":
        return propostas.map((p) => ({
          pedido: p.pedido || "-", cliente: clienteNome(p.clienteId) !== "-" ? clienteNome(p.clienteId) : (p.cliente || "-"), status: p.status, criada: fmtDate((p.criadaEm || "").slice(0, 10)),
        }));
      case "Clientes":
        return clientes.map((c) => ({
          nome: c.nome, telefone: c.telefone || "-", cidade: c.municipio || "-", obras: (c.obras || []).length, status: c.status,
        }));
      case "Faturamento":
        return financeiro.filter((f) => f.tipo === "Receber" && f.status === "Pago" && noPeriodo(f.dataPagamento || "")).map((f) => ({
          data: fmtDate(f.dataPagamento), cliente: clienteNome(f.clienteId) !== "-" ? clienteNome(f.clienteId) : (f.descricao || "-"), valor: money(f.valor),
        }));
      case "Contas a receber":
        return financeiro.filter((f) => f.tipo === "Receber" && f.status !== "Pago" && f.status !== "Cancelado" && noPeriodo(f.vencimento || "")).map((f) => ({
          vencimento: fmtDate(f.vencimento), cliente: clienteNome(f.clienteId) !== "-" ? clienteNome(f.clienteId) : (f.descricao || "-"), valor: money(f.valor), status: f.status,
        }));
      case "Contas a pagar":
        return despesas.filter((d) => d.status !== "Pago" && noPeriodo(d.vencimento || "")).map((d) => ({
          vencimento: fmtDate(d.vencimento), categoria: d.categoria || "-", descricao: d.descricao || "-", valor: money(d.valor),
        }));
      case "Inadimplência": {
        const hoje = new Date().toISOString().slice(0, 10);
        return financeiro.filter((f) => f.tipo === "Receber" && f.status !== "Pago" && f.status !== "Cancelado" && dataOrdenavel(f.vencimento) < dataOrdenavel(hoje)).map((f) => ({
          cliente: clienteNome(f.clienteId) !== "-" ? clienteNome(f.clienteId) : (f.descricao || "-"), vencimento: fmtDate(f.vencimento), diasAtraso: Math.floor((new Date(hoje) - new Date(f.vencimento)) / 86400000), valor: money(f.valor),
        }));
      }
      case "Utilização das bombas":
        return bombas.map((b) => {
          const usos = agendamentos.filter((a) => a.bombaId === b.id && a.status !== "Cancelado");
          return { codigo: b.codigo, status: b.status, servicos: usos.length, volumeTotal: usos.reduce((s, a) => s + numeroSeguro(a.volume), 0).toFixed(1) };
        });
      case "Manutenção dos equipamentos":
        return manutencoes.map((m) => ({
          bomba: bombas.find((b) => b.id === m.maquinaId)?.codigo || m.maquina || "-", data: fmtDate(m.data), descricao: m.descricao || "-", valor: money(m.valor), status: m.status || "-",
        }));
      case "Comissão de vendedores":
        return (vendedores || []).map((v) => {
          const fechadas = propostas.filter((p) => p.vendedorId === v.id && p.status === "Fechada");
          const totalVendido = fechadas.reduce((s, p) => s + p.itens.reduce((s2, it) => s2 + (Number(it.qtd) || 0) * (Number(it.valorUnit) || 0), 0), 0);
          const percentual = Number(v.comissaoPercentual) || 0;
          return {
            vendedor: v.nome, propostasFechadas: fechadas.length, totalVendido: money(totalVendido), percentual: `${percentual}%`, comissao: money(totalVendido * percentual / 100),
          };
        });
      default:
        return [];
    }
  }, [relatorio, dataIni, dataFim, clientes, bombas, agendamentos, ordensServico, propostas, financeiro, despesas, manutencoes, vendedores]);

  const colunas = dados.length > 0 ? Object.keys(dados[0]).map((k) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), get: (l) => l[k] })) : [];

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Relatório Geral" title="Relatórios" />
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "20px" }}>
        <Field label="Relatório">
          <Select value={relatorio} onChange={(e) => setRelatorio(e.target.value)} style={{ minWidth: "220px" }}>
            {RELATORIOS_BOMBAS.map((r) => <option key={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="De">
          <Input type="date" value={dataIni} onChange={(e) => setDataIni(e.target.value)} />
        </Field>
        <Field label="Até">
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </Field>
        <Button variant="subtle" icon={Download} onClick={() => exportarCSV(relatorio, dados, colunas)}>Exportar Excel</Button>
        <Button variant="subtle" icon={Printer} onClick={() => window.print()}>Imprimir / PDF</Button>
      </div>

      <div className="tl-print-area">
        <div style={{ display: "none" }} className="tl-print-only">
          <h2>{relatorio}</h2>
        </div>
        {dados.length === 0 ? (
          <EmptyState icon={BarChart3} title="Nada encontrado com esse filtro" />
        ) : (
          <Table
            columns={colunas.map((c) => c.label)}
            rows={dados.map((linha, i) => (
              <tr key={i} style={rowStyle}>
                {colunas.map((c) => (
                  <td key={c.label} style={tdStyle}>{c.get(linha)}</td>
                ))}
              </tr>
            ))}
          />
        )}
      </div>
    </div>
  );
}

function DashboardBombas({ clientes, bombas, agendamentos, ordensServico, propostas, financeiro, despesas, goTo }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const em7dias = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const clienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "-";
  const bombaNome = (id) => bombas.find((b) => b.id === id)?.codigo || "-";

  const servicosHoje = (agendamentos || []).filter((a) => a.data === hoje && a.status !== "Cancelado");
  const proximosServicos = (agendamentos || [])
    .filter((a) => a.data > hoje && a.status !== "Cancelado")
    .sort((a, b) => (a.data + (a.horarioInicio || "")).localeCompare(b.data + (b.horarioInicio || "")))
    .slice(0, 5);

  const bombasDisponiveis = bombas.filter((b) => b.status === "Disponível").length;
  const bombasOperacao = bombas.filter((b) => b.status === "Em operação").length;
  const bombasManutencao = bombas.filter((b) => b.status === "Em manutenção").length;

  const propostasPendentes = propostas.filter((p) => p.status === "Aberta").length;
  const propostasAprovadas = propostas.filter((p) => p.status === "Fechada").length;

  const contasReceber = (financeiro || []).filter((c) => c.tipo === "Receber");
  const valoresReceber = contasReceber.filter((c) => c.status !== "Pago" && c.status !== "Cancelado").reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const valoresRecebidos = contasReceber.filter((c) => c.status === "Pago" && (c.dataPagamento || "").slice(0, 7) === hoje.slice(0, 7)).reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const valoresAtraso = contasReceber.filter((c) => c.status !== "Pago" && c.status !== "Cancelado" && dataOrdenavel(c.vencimento) < dataOrdenavel(hoje)).reduce((s, c) => s + numeroSeguro(c.valor), 0);

  const contasPagarAbertas = (despesas || []).filter((d) => d.status !== "Pago").reduce((s, d) => s + numeroSeguro(d.valor), 0);

  const faturamentoMes = contasReceber.filter((c) => c.status === "Pago" && (c.dataPagamento || "").slice(0, 7) === hoje.slice(0, 7)).reduce((s, c) => s + numeroSeguro(c.valor), 0);
  const servicosRealizados = (ordensServico || []).filter((o) => o.status === "Finalizada").length;

  // Alertas montados sozinhos a partir dos dados — sem precisar de nenhum cadastro à parte.
  const alertas = [];
  servicosHoje.forEach((a) => alertas.push({ icone: Calendar, texto: `Serviço hoje às ${a.horarioInicio || "?"} — ${clienteNome(a.clienteId)}`, tab: "agenda" }));
  (agendamentos || []).filter((a) => a.data === em7dias && a.status !== "Cancelado").forEach((a) =>
    alertas.push({ icone: Clock, texto: `Serviço em 7 dias — ${clienteNome(a.clienteId)}`, tab: "agenda" })
  );
  if (propostasPendentes > 0) alertas.push({ icone: FileText, texto: `${propostasPendentes} proposta(s) aguardando aprovação`, tab: "propostas" });
  contasReceber.filter((c) => c.status !== "Pago" && c.status !== "Cancelado" && dataOrdenavel(c.vencimento) < dataOrdenavel(hoje)).forEach((c) =>
    alertas.push({ icone: AlertTriangle, texto: `Conta em atraso: ${c.descricao || clienteNome(c.clienteId)} — ${money(c.valor)}`, tab: "financeiro" })
  );
  bombas.filter((b) => b.status === "Em manutenção").forEach((b) => alertas.push({ icone: Wrench, texto: `Bomba ${b.codigo} em manutenção`, tab: "manutencao" }));
  (agendamentos || []).forEach((a) => {
    const conflito = temConflitoAgenda(agendamentos, a.bombaId, a.data, a.horarioInicio, a.horarioFim, a.id);
    if (conflito && a.status !== "Cancelado" && a.data >= hoje) {
      alertas.push({ icone: AlertTriangle, texto: `Conflito de agenda — bomba ${bombaNome(a.bombaId)} em ${fmtDate(a.data)}`, tab: "agenda" });
    }
  });
  // remove duplicados de conflito (cada par gera 2 avisos iguais)
  const alertasUnicos = alertas.filter((a, i) => alertas.findIndex((b) => b.texto === a.texto) === i);

  const Card = ({ label, valor, cor, onClick }) => (
    <div onClick={onClick} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "10px", padding: "16px 18px", cursor: onClick ? "pointer" : "default" }}>
      <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "6px" }}>{label}</div>
      <div className="tl-display" style={{ fontSize: "22px", fontWeight: 800, color: cor || "var(--text-primary)" }}>{valor}</div>
    </div>
  );

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Visão geral" title="Painel" />

      <h4 className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Operação</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <Card label="Serviços hoje" valor={servicosHoje.length} onClick={() => goTo("agenda")} />
        <Card label="Bombas disponíveis" valor={bombasDisponiveis} cor="var(--success)" onClick={() => goTo("bombas")} />
        <Card label="Bombas em operação" valor={bombasOperacao} onClick={() => goTo("bombas")} />
        <Card label="Bombas em manutenção" valor={bombasManutencao} cor="var(--amber)" onClick={() => goTo("manutencao")} />
        <Card label="Serviços realizados" valor={servicosRealizados} onClick={() => goTo("ordensServico")} />
      </div>

      <h4 className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Comercial</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <Card label="Propostas pendentes" valor={propostasPendentes} cor="var(--amber)" onClick={() => goTo("propostas")} />
        <Card label="Propostas aprovadas" valor={propostasAprovadas} cor="var(--success)" onClick={() => goTo("propostas")} />
      </div>

      <h4 className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Financeiro</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <Card label="A receber" valor={money(valoresReceber)} onClick={() => goTo("financeiro")} />
        <Card label="Recebido no mês" valor={money(valoresRecebidos)} cor="var(--success)" onClick={() => goTo("financeiro")} />
        <Card label="Em atraso" valor={money(valoresAtraso)} cor="var(--danger)" onClick={() => goTo("financeiro")} />
        <Card label="Contas a pagar" valor={money(contasPagarAbertas)} onClick={() => goTo("despesas")} />
        <Card label="Faturamento do mês" valor={money(faturamentoMes)} cor="var(--accent)" onClick={() => goTo("financeiro")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px" }}>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "10px", padding: "18px 20px" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "12px" }}>Próximos serviços</div>
          {proximosServicos.length === 0 ? (
            <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Nada agendado pros próximos dias.</p>
          ) : (
            proximosServicos.map((a) => (
              <div key={a.id} onClick={() => goTo("agenda")} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "12.5px", cursor: "pointer" }}>
                <span>{clienteNome(a.clienteId)} — {a.obraTexto || "obra não informada"}</span>
                <span style={{ color: "var(--text-muted)" }}>{fmtDate(a.data)} {a.horarioInicio || ""}</span>
              </div>
            ))
          )}
        </div>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "10px", padding: "18px 20px" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "12px" }}>Alertas</div>
          {alertasUnicos.length === 0 ? (
            <p style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Tudo certo por aqui — nenhum alerta no momento.</p>
          ) : (
            alertasUnicos.map((a, i) => {
              const Icone = a.icone;
              return (
                <div key={i} onClick={() => goTo(a.tab)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: "1px solid var(--border-soft)", fontSize: "12px", cursor: "pointer" }}>
                  <Icone size={13} style={{ color: "var(--amber)", flexShrink: 0 }} />
                  <span>{a.texto}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function BombasModule({ bombas, agendamentos, onChange }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const salvar = (item) => {
    const existe = bombas.some((b) => b.id === item.id);
    onChange(existe ? bombas.map((b) => (b.id === item.id ? item : b)) : [...bombas, item]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(bombas.filter((b) => b.id !== id));
    setDeleting(null);
  };

  const usoRecente = (bombaId) =>
    (agendamentos || []).filter((a) => a.bombaId === bombaId).sort((x, y) => dataOrdenavel(y.data).localeCompare(dataOrdenavel(x.data))).slice(0, 5);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Equipamento"
        title="Bombas"
        action={<Button icon={Plus} onClick={() => setEditing(emptyBomba())}>Nova bomba</Button>}
      />
      {bombas.length === 0 ? (
        <EmptyState icon={Droplet} title="Nenhuma bomba cadastrada ainda" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {bombas.map((b) => (
            <div key={b.id} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "15px" }}>{b.codigo || "Sem código"}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{b.marca} {b.modelo} {b.ano ? `· ${b.ano}` : ""}</div>
                </div>
                <BadgeBomba status={b.status} />
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px" }}>
                {b.tipo} {b.alcance ? `· Alcance ${b.alcance}` : ""} {b.capacidade ? `· ${b.capacidade}` : ""}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "11.5px", marginBottom: "10px" }}>
                <div><div style={{ color: "var(--text-faint)" }}>Diária</div><div className="tl-mono" style={{ fontWeight: 600 }}>{money(b.valorDiaria)}</div></div>
                <div><div style={{ color: "var(--text-faint)" }}>Hora</div><div className="tl-mono" style={{ fontWeight: 600 }}>{money(b.valorHora)}</div></div>
                <div><div style={{ color: "var(--text-faint)" }}>Mínimo</div><div className="tl-mono" style={{ fontWeight: 600 }}>{money(b.valorMinimo)}</div></div>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-faint)", marginBottom: "10px" }}>Horímetro atual: {b.horimetro || "-"}</div>
              <RowActions onEdit={() => setEditing(b)} onDelete={() => setDeleting(b)} />
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.codigo ? "Editar bomba" : "Nova bomba"} onClose={() => setEditing(null)} wide>
          <form onSubmit={(e) => { e.preventDefault(); salvar(editing); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Código/identificação" required>
                <Input value={editing.codigo} onChange={(e) => setEditing({ ...editing, codigo: e.target.value })} required />
              </Field>
              <Field label="Tipo">
                <Select value={editing.tipo} onChange={(e) => setEditing({ ...editing, tipo: e.target.value })}>
                  <option>Lança</option>
                  <option>Estacionária</option>
                  <option>Outra</option>
                </Select>
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
              <Field label="Marca">
                <Input value={editing.marca} onChange={(e) => setEditing({ ...editing, marca: e.target.value })} />
              </Field>
              <Field label="Modelo">
                <Input value={editing.modelo} onChange={(e) => setEditing({ ...editing, modelo: e.target.value })} />
              </Field>
              <Field label="Ano">
                <Input value={editing.ano} onChange={(e) => setEditing({ ...editing, ano: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
              <Field label="Alcance">
                <Input value={editing.alcance} onChange={(e) => setEditing({ ...editing, alcance: e.target.value })} placeholder="Ex: 36m" />
              </Field>
              <Field label="Capacidade">
                <Input value={editing.capacidade} onChange={(e) => setEditing({ ...editing, capacidade: e.target.value })} placeholder="Ex: 90 m³/h" />
              </Field>
              <Field label="Horímetro">
                <Input value={editing.horimetro} onChange={(e) => setEditing({ ...editing, horimetro: e.target.value })} />
              </Field>
            </div>
            <Field label="Status">
              <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {STATUS_BOMBA.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
              <Field label="Valor diária (R$)">
                <Input type="number" min="0" step="0.01" value={editing.valorDiaria} onChange={(e) => setEditing({ ...editing, valorDiaria: e.target.value })} />
              </Field>
              <Field label="Valor por hora (R$)">
                <Input type="number" min="0" step="0.01" value={editing.valorHora} onChange={(e) => setEditing({ ...editing, valorHora: e.target.value })} />
              </Field>
              <Field label="Valor mínimo (R$)">
                <Input type="number" min="0" step="0.01" value={editing.valorMinimo} onChange={(e) => setEditing({ ...editing, valorMinimo: e.target.value })} />
              </Field>
            </div>
            <Field label="Observações">
              <Input value={editing.observacao} onChange={(e) => setEditing({ ...editing, observacao: e.target.value })} />
            </Field>
            {usoRecente(editing.id).length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div className="tl-mono" style={{ fontSize: "10.5px", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "6px" }}>Últimos usos</div>
                {usoRecente(editing.id).map((a) => (
                  <div key={a.id} style={{ fontSize: "12px", color: "var(--text-muted)", padding: "4px 0" }}>{fmtDate(a.data)} — {a.tipoServico || "Serviço"} ({a.status})</div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete label={`a bomba "${deleting.codigo}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Agenda de serviços (bombas)                                       */
/* ------------------------------------------------------------------ */

const STATUS_AGENDAMENTO = ["Solicitação", "Orçamento", "Agendado", "Confirmado", "Em deslocamento", "Em execução", "Finalizado", "Cancelado"];
const STATUS_AGENDAMENTO_STYLES = {
  "Solicitação": { bg: "#363D49", fg: "#AEB5C2" },
  "Orçamento": { bg: "#3D2B54", fg: "#CBA6F2" },
  "Agendado": { bg: "#2C3F55", fg: "#8CBCE8" },
  "Confirmado": { bg: "#1F3D2A", fg: "#7BC492" },
  "Em deslocamento": { bg: "#52431D", fg: "#F0B958" },
  "Em execução": { bg: "#52431D", fg: "#F0B958" },
  "Finalizado": { bg: "#1F3D2A", fg: "#7BC492" },
  "Cancelado": { bg: "#532B2B", fg: "#E88886" },
};

function BadgeAgendamento({ status }) {
  const s = STATUS_AGENDAMENTO_STYLES[status] || { bg: "#363D49", fg: "#AEB5C2" };
  return <span style={{ background: s.bg, color: s.fg, padding: "2px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>{status}</span>;
}

const emptyAgendamento = () => ({
  id: uid(),
  clienteId: "",
  obraTexto: "", // nome/endereço da obra em texto livre (cadastro completo de obras por cliente vem numa próxima etapa)
  enderecoObra: "",
  data: new Date().toISOString().slice(0, 10),
  horarioInicio: "",
  horarioFim: "",
  bombaId: "",
  operador: "",
  tipoServico: "",
  volume: "",
  distancia: "",
  observacao: "",
  status: "Solicitação",
});

// Verifica se já existe outro agendamento pra MESMA bomba no MESMO dia com
// horário sobreposto — usado pra alertar o usuário antes de confirmar.
function temConflitoAgenda(agendamentos, bombaId, data, inicio, fim, ignorarId) {
  if (!bombaId || !data) return null;
  const ini = inicio || "00:00";
  const fimC = fim || "23:59";
  return (agendamentos || []).find((a) => {
    if (a.id === ignorarId || a.status === "Cancelado") return false;
    if (a.bombaId !== bombaId || a.data !== data) return false;
    const aIni = a.horarioInicio || "00:00";
    const aFim = a.horarioFim || "23:59";
    return ini < aFim && fimC > aIni;
  });
}

function AgendaBombasModule({ agendamentos, bombas, clientes, onChange, onGerarOS }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [visao, setVisao] = useState("semana"); // dia | semana | mes
  const [dataRef, setDataRef] = useState(new Date().toISOString().slice(0, 10));
  const [erroConflito, setErroConflito] = useState("");

  const bombaNome = (id) => bombas.find((b) => b.id === id)?.codigo || "-";
  const clienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "-";

  const salvar = (item) => {
    const conflito = temConflitoAgenda(agendamentos, item.bombaId, item.data, item.horarioInicio, item.horarioFim, item.id);
    if (conflito && item.status !== "Cancelado") {
      setErroConflito(`Essa bomba já está reservada em ${fmtDate(conflito.data)} das ${conflito.horarioInicio || "?"} às ${conflito.horarioFim || "?"} (${clienteNome(conflito.clienteId)}). Ajusta o horário ou confirma mesmo assim salvando de novo.`);
      // Deixa salvar mesmo com conflito na 2ª tentativa (não bloqueia — só avisa)
      if (!item.__conflitoConfirmado) {
        setEditing({ ...item, __conflitoConfirmado: true });
        return;
      }
    }
    setErroConflito("");
    const existe = agendamentos.some((a) => a.id === item.id);
    const limpo = { ...item };
    delete limpo.__conflitoConfirmado;
    onChange(existe ? agendamentos.map((a) => (a.id === item.id ? limpo : a)) : [...agendamentos, limpo]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(agendamentos.filter((a) => a.id !== id));
    setDeleting(null);
  };

  // Filtra pela visão escolhida (dia/semana/mês), com base em dataRef
  const filtrados = useMemo(() => {
    const ref = new Date(`${dataRef}T00:00:00`);
    return agendamentos
      .filter((a) => {
        if (!a.data) return false;
        const d = new Date(`${a.data}T00:00:00`);
        if (visao === "dia") return a.data === dataRef;
        if (visao === "semana") {
          const diff = (d - ref) / 86400000;
          return diff >= -ref.getDay() && diff < 7 - ref.getDay();
        }
        // mes
        return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
      })
      .sort((a, b) => (a.data + (a.horarioInicio || "")).localeCompare(b.data + (b.horarioInicio || "")));
  }, [agendamentos, visao, dataRef]);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Operação"
        title="Agenda de Serviços"
        action={<Button icon={Plus} onClick={() => setEditing(emptyAgendamento())}>Novo agendamento</Button>}
      />
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "18px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-base)", padding: "4px", borderRadius: "8px" }}>
          {["dia", "semana", "mes"].map((v) => (
            <button
              key={v}
              onClick={() => setVisao(v)}
              className="tl-focus"
              style={{
                padding: "6px 14px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12.5px", fontWeight: 700,
                background: visao === v ? "var(--accent)" : "transparent",
                color: visao === v ? "#fff" : "var(--text-muted)",
              }}
            >
              {v === "dia" ? "Dia" : v === "semana" ? "Semana" : "Mês"}
            </button>
          ))}
        </div>
        <Input type="date" value={dataRef} onChange={(e) => setDataRef(e.target.value)} style={{ width: "170px" }} />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={Calendar} title="Nenhum agendamento nesse período" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtrados.map((a) => {
            const conflito = temConflitoAgenda(agendamentos, a.bombaId, a.data, a.horarioInicio, a.horarioFim, a.id);
            return (
              <div key={a.id} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 700, fontSize: "13.5px" }}>{fmtDate(a.data)}</span>
                    <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{a.horarioInicio || "?"} — {a.horarioFim || "?"}</span>
                    <BadgeAgendamento status={a.status} />
                    {conflito && a.status !== "Cancelado" && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--danger)", fontWeight: 700 }}>
                        <AlertTriangle size={12} /> Conflito de horário
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {a.status !== "Cancelado" && (
                      <Button size="sm" variant="subtle" icon={ClipboardList} onClick={() => onGerarOS(a)}>Gerar OS</Button>
                    )}
                    <RowActions onEdit={() => setEditing(a)} onDelete={() => setDeleting(a)} />
                  </div>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                  <strong>{clienteNome(a.clienteId)}</strong> — {a.obraTexto || a.enderecoObra || "obra não informada"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-faint)", marginTop: "2px" }}>
                  Bomba: {bombaNome(a.bombaId)} · {a.tipoServico || "-"} {a.volume ? `· ${a.volume} m³` : ""} {a.operador ? `· Operador: ${a.operador}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <Modal title={editing.clienteId ? "Editar agendamento" : "Novo agendamento"} onClose={() => setEditing(null)} wide>
          {erroConflito && (
            <div style={{ background: "#52431D", color: "#F0B958", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "12.5px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{erroConflito}</span>
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); salvar(editing); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Cliente" required>
                <Select value={editing.clienteId} onChange={(e) => setEditing({ ...editing, clienteId: e.target.value })} required>
                  <option value="">Selecione...</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </Select>
              </Field>
              <Field label="Bomba" required>
                <Select value={editing.bombaId} onChange={(e) => setEditing({ ...editing, bombaId: e.target.value })} required>
                  <option value="">Selecione...</option>
                  {bombas.map((b) => <option key={b.id} value={b.id}>{b.codigo} — {b.marca} {b.modelo}</option>)}
                </Select>
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0 16px" }}>
              <Field label="Obra (nome/local)">
                <Input value={editing.obraTexto} onChange={(e) => setEditing({ ...editing, obraTexto: e.target.value })} />
              </Field>
              <Field label="Data" required>
                <Input type="date" value={editing.data} onChange={(e) => setEditing({ ...editing, data: e.target.value })} required />
              </Field>
            </div>
            <Field label="Endereço da obra">
              <Input value={editing.enderecoObra} onChange={(e) => setEditing({ ...editing, enderecoObra: e.target.value })} />
            </Field>
            {editing.enderecoObra && (
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(editing.enderecoObra)}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--accent)", marginBottom: "14px" }}>
                <MapPin size={13} /> Abrir rota
              </a>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Horário de início">
                <Input type="time" value={editing.horarioInicio} onChange={(e) => setEditing({ ...editing, horarioInicio: e.target.value })} />
              </Field>
              <Field label="Horário previsto de término">
                <Input type="time" value={editing.horarioFim} onChange={(e) => setEditing({ ...editing, horarioFim: e.target.value })} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Operador/motorista">
                <Input value={editing.operador} onChange={(e) => setEditing({ ...editing, operador: e.target.value })} />
              </Field>
              <Field label="Tipo de serviço">
                <Input value={editing.tipoServico} onChange={(e) => setEditing({ ...editing, tipoServico: e.target.value })} placeholder="Ex: Bombeamento de laje" />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Volume de concreto (m³)">
                <Input type="number" min="0" step="0.1" value={editing.volume} onChange={(e) => setEditing({ ...editing, volume: e.target.value })} />
              </Field>
              <Field label="Distância">
                <Input value={editing.distancia} onChange={(e) => setEditing({ ...editing, distancia: e.target.value })} placeholder="Ex: 18 km" />
              </Field>
            </div>
            <Field label="Status">
              <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {STATUS_AGENDAMENTO.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Observações">
              <Input value={editing.observacao} onChange={(e) => setEditing({ ...editing, observacao: e.target.value })} />
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete label="esse agendamento" dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ordens de Serviço                                                  */
/* ------------------------------------------------------------------ */

const emptyOrdemServico = (base) => ({
  id: uid(),
  agendamentoId: base?.id || "",
  clienteId: base?.clienteId || "",
  obraTexto: base?.obraTexto || "",
  enderecoObra: base?.enderecoObra || "",
  data: base?.data || new Date().toISOString().slice(0, 10),
  horario: base?.horarioInicio || "",
  bombaId: base?.bombaId || "",
  operador: base?.operador || "",
  servico: base?.tipoServico || "",
  valor: "",
  observacao: base?.observacao || "",
  status: "Aberta", // Aberta | Finalizada | Cancelada
  horarioChegada: "",
  horarioInicioExec: "",
  horarioTermino: "",
  horimetroInicial: "",
  horimetroFinal: "",
  quantidadeRealizada: "",
  ocorrencias: "",
  assinaturaResponsavel: "",
});

function OrdensServicoModule({ ordens, clientes, bombas, agendamentos, onChange, draft, onDraftHandled }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (draft) {
      setEditing(emptyOrdemServico(draft));
      onDraftHandled();
    }
  }, [draft]);

  const clienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "-";
  const bombaNome = (id) => bombas.find((b) => b.id === id)?.codigo || "-";

  const salvar = (item) => {
    const existe = ordens.some((o) => o.id === item.id);
    onChange(existe ? ordens.map((o) => (o.id === item.id ? item : o)) : [...ordens, item]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(ordens.filter((o) => o.id !== id));
    setDeleting(null);
  };

  const ordenadas = [...ordens].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data)));

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Execução"
        title="Ordens de Serviço"
        action={<Button icon={Plus} onClick={() => setEditing(emptyOrdemServico())}>Nova OS</Button>}
      />
      {ordenadas.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma ordem de serviço ainda" hint='Gera uma OS direto de um agendamento na Agenda, com o botão "Gerar OS".' />
      ) : (
        <Table
          columns={["Data", "Cliente", "Obra", "Bomba", "Valor", "Status", ""]}
          rows={ordenadas.map((o) => (
            <tr key={o.id} style={rowStyle}>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(o.data)}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{clienteNome(o.clienteId)}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{o.obraTexto || "-"}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{bombaNome(o.bombaId)}</td>
              <td style={tdStyle} className="tl-mono">{money(o.valor)}</td>
              <td style={tdStyle}><StatusBadge status={o.status === "Finalizada" ? "PAGO" : o.status === "Cancelada" ? "CANCELADO" : "EM ABERTO"} /></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <RowActions onEdit={() => setEditing(o)} onDelete={() => setDeleting(o)} />
              </td>
            </tr>
          ))}
        />
      )}
      {editing && (
        <Modal title={editing.clienteId ? "Ordem de Serviço" : "Nova OS"} onClose={() => setEditing(null)} wide>
          <form onSubmit={(e) => { e.preventDefault(); salvar(editing); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Cliente" required>
                <Select value={editing.clienteId} onChange={(e) => setEditing({ ...editing, clienteId: e.target.value })} required>
                  <option value="">Selecione...</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </Select>
              </Field>
              <Field label="Bomba">
                <Select value={editing.bombaId} onChange={(e) => setEditing({ ...editing, bombaId: e.target.value })}>
                  <option value="">Selecione...</option>
                  {bombas.map((b) => <option key={b.id} value={b.id}>{b.codigo}</option>)}
                </Select>
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0 16px" }}>
              <Field label="Obra">
                <Input value={editing.obraTexto} onChange={(e) => setEditing({ ...editing, obraTexto: e.target.value })} />
              </Field>
              <Field label="Data">
                <Input type="date" value={editing.data} onChange={(e) => setEditing({ ...editing, data: e.target.value })} />
              </Field>
            </div>
            <Field label="Endereço da obra">
              <Input value={editing.enderecoObra} onChange={(e) => setEditing({ ...editing, enderecoObra: e.target.value })} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Operador">
                <Input value={editing.operador} onChange={(e) => setEditing({ ...editing, operador: e.target.value })} />
              </Field>
              <Field label="Serviço contratado">
                <Input value={editing.servico} onChange={(e) => setEditing({ ...editing, servico: e.target.value })} />
              </Field>
            </div>
            <Field label="Valor (R$)">
              <Input type="number" min="0" step="0.01" value={editing.valor} onChange={(e) => setEditing({ ...editing, valor: e.target.value })} />
            </Field>

            <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "8px", padding: "14px 16px", margin: "8px 0 16px 0" }}>
              <div className="tl-mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Registro de execução</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
                <Field label="Chegada">
                  <Input type="time" value={editing.horarioChegada} onChange={(e) => setEditing({ ...editing, horarioChegada: e.target.value })} />
                </Field>
                <Field label="Início">
                  <Input type="time" value={editing.horarioInicioExec} onChange={(e) => setEditing({ ...editing, horarioInicioExec: e.target.value })} />
                </Field>
                <Field label="Término">
                  <Input type="time" value={editing.horarioTermino} onChange={(e) => setEditing({ ...editing, horarioTermino: e.target.value })} />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
                <Field label="Horímetro inicial">
                  <Input value={editing.horimetroInicial} onChange={(e) => setEditing({ ...editing, horimetroInicial: e.target.value })} />
                </Field>
                <Field label="Horímetro final">
                  <Input value={editing.horimetroFinal} onChange={(e) => setEditing({ ...editing, horimetroFinal: e.target.value })} />
                </Field>
                <Field label="Qtd. realizada (m³)">
                  <Input type="number" min="0" step="0.1" value={editing.quantidadeRealizada} onChange={(e) => setEditing({ ...editing, quantidadeRealizada: e.target.value })} />
                </Field>
              </div>
              <Field label="Ocorrências">
                <Input value={editing.ocorrencias} onChange={(e) => setEditing({ ...editing, ocorrencias: e.target.value })} placeholder="Deixa em branco se não teve nada fora do combinado" />
              </Field>
              <Field label="Assinatura do responsável pela obra" hint="Digita o nome de quem está confirmando o serviço">
                <Input value={editing.assinaturaResponsavel} onChange={(e) => setEditing({ ...editing, assinaturaResponsavel: e.target.value })} />
              </Field>
            </div>

            <Field label="Status">
              <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                <option>Aberta</option>
                <option>Finalizada</option>
                <option>Cancelada</option>
              </Select>
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete label="essa ordem de serviço" dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

const emptyCompraMaterial = () => ({
  id: uid(),
  data: new Date().toISOString().slice(0, 10),
  material: "Cimento",
  quantidade: "",
  valorUnitario: "",
  fornecedor: "",
  vencimento: "",
  status: "Pendente", // Pendente | Pago
  despesaId: "",
});

function CompraMaterialModule({ compras, onChangeCompras, onChangeDespesas, despesas, onChangeMovimentos, movimentos }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const salvar = (compra) => {
    const quantidade = Number(compra.quantidade) || 0;
    const valorUnitario = Number(compra.valorUnitario) || 0;
    const valorTotal = quantidade * valorUnitario;
    const jaExiste = compras.some((c) => c.id === compra.id);

    // Cria (ou atualiza) a despesa correspondente em Despesas Fixas —
    // assim toda compra de material já entra no financeiro sozinha.
    let despesaId = compra.despesaId;
    const dadosDespesa = {
      categoria: "Material/Insumos",
      descricao: `Compra de ${compra.material}${compra.fornecedor ? ` — ${compra.fornecedor}` : ""}`,
      valor: valorTotal,
      vencimento: compra.vencimento || compra.data,
      status: compra.status === "Pago" ? "Pago" : "Pendente",
      dataPagamento: compra.status === "Pago" ? compra.data : "",
      recorrente: false,
      observacao: `${quantidade} ${UNIDADE_POR_MATERIAL[compra.material] || ""} × ${money(valorUnitario)}`,
    };
    if (despesaId && despesas.some((d) => d.id === despesaId)) {
      onChangeDespesas(despesas.map((d) => (d.id === despesaId ? { ...d, ...dadosDespesa } : d)));
    } else {
      despesaId = uid();
      onChangeDespesas([...despesas, { id: despesaId, ...dadosDespesa }]);
    }

    // Cria (ou atualiza) o movimento de entrada no estoque, se o material
    // for controlado em estoque (Diesel fica de fora).
    if (MATERIAIS_ESTOCADOS.includes(compra.material)) {
      const movimentoExistente = movimentos.find((m) => m.compraId === compra.id);
      const dadosMovimento = {
        compraId: compra.id,
        data: compra.data,
        material: compra.material,
        tipo: "Entrada",
        quantidade,
        motivo: `Compra${compra.fornecedor ? ` — ${compra.fornecedor}` : ""}`,
      };
      if (movimentoExistente) {
        onChangeMovimentos(movimentos.map((m) => (m.id === movimentoExistente.id ? { ...m, ...dadosMovimento } : m)));
      } else {
        onChangeMovimentos([...movimentos, { id: uid(), ...dadosMovimento }]);
      }
    }

    const compraFinal = { ...compra, despesaId, valorTotal };
    onChangeCompras(jaExiste ? compras.map((c) => (c.id === compra.id ? compraFinal : c)) : [...compras, compraFinal]);
    setEditing(null);
  };

  const remove = (compra) => {
    onChangeCompras(compras.filter((c) => c.id !== compra.id));
    if (compra.despesaId) onChangeDespesas(despesas.filter((d) => d.id !== compra.despesaId));
    onChangeMovimentos(movimentos.filter((m) => m.compraId !== compra.id));
    setDeleting(null);
  };

  const totalGeral = compras.reduce((s, c) => s + (Number(c.valorTotal) || Number(c.quantidade) * Number(c.valorUnitario) || 0), 0);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Insumos"
        title="Compra de Material"
        action={<Button icon={Plus} onClick={() => setEditing(emptyCompraMaterial())}>Nova compra</Button>}
      />
      <div style={{ marginBottom: "18px" }}>
        <MiniStat label="Total comprado" valor={money(totalGeral)} />
      </div>
      {compras.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Nenhuma compra registrada ainda" hint="Cada compra já cria a despesa no Financeiro e a entrada no Estoque sozinha." />
      ) : (
        <Table
          columns={["Data", "Material", "Quantidade", "Valor unit.", "Total", "Fornecedor", "Status", ""]}
          rows={[...compras].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data))).map((c) => (
            <tr key={c.id} style={rowStyle}>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(c.data)}</td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{c.material}</td>
              <td style={tdStyle} className="tl-mono">{c.quantidade} {UNIDADE_POR_MATERIAL[c.material]}</td>
              <td style={tdStyle} className="tl-mono">{money(c.valorUnitario)}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(c.valorTotal || Number(c.quantidade) * Number(c.valorUnitario))}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{c.fornecedor || "-"}</td>
              <td style={tdStyle}><FinStatusBadge status={c.status} /></td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <RowActions onEdit={() => setEditing(c)} onDelete={() => setDeleting(c)} />
              </td>
            </tr>
          ))}
        />
      )}
      {editing && (
        <CompraMaterialForm initial={editing} onSave={salvar} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDelete label={`a compra de "${deleting.material}"`} dados={deleting} onConfirm={() => remove(deleting)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

function CompraMaterialForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valorTotal = (Number(form.quantidade) || 0) * (Number(form.valorUnitario) || 0);

  return (
    <Modal title={initial.material && initial.fornecedor ? "Editar compra" : "Nova compra de material"} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Material">
            <Select value={form.material} onChange={set("material")}>
              {MATERIAIS_AGREGADOS.map((m) => <option key={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Data">
            <Input type="date" value={form.data} onChange={set("data")} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label={`Quantidade (${UNIDADE_POR_MATERIAL[form.material] || "un."})`}>
            <Input type="number" min="0" step="0.01" value={form.quantidade} onChange={set("quantidade")} required />
          </Field>
          <Field label="Valor por tonelada (R$)">
            <Input type="number" min="0" step="0.01" value={form.valorUnitario} onChange={set("valorUnitario")} required />
          </Field>
        </div>
        <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "9px 12px", marginBottom: "16px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
          <span style={{ color: "var(--text-muted)" }}>Valor total</span>
          <strong className="tl-mono">{money(valorTotal)}</strong>
        </div>
        <Field label="Fornecedor">
          <Input value={form.fornecedor} onChange={set("fornecedor")} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Vencimento" hint="Se vazio, usa a data da compra">
            <Input type="date" value={form.vencimento} onChange={set("vencimento")} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              <option>Pendente</option>
              <option>Pago</option>
            </Select>
          </Field>
        </div>
        <p style={{ fontSize: "11.5px", color: "var(--text-faint)", marginBottom: "16px" }}>
          Ao salvar, essa compra já cria (ou atualiza) automaticamente uma despesa em "Despesas Fixas" e uma entrada no "Estoque de Materiais".
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar compra</Button>
        </div>
      </form>
    </Modal>
  );
}

function EstoqueModule({ movimentos, onChange }) {
  const [registrandoSaida, setRegistrandoSaida] = useState(null); // material selecionado
  const [excluindo, setExcluindo] = useState(null); // movimento selecionado pra excluir

  const saldoPorMaterial = useMemo(() => {
    const mapa = {};
    MATERIAIS_ESTOCADOS.forEach((m) => (mapa[m] = 0));
    (movimentos || []).forEach((mv) => {
      if (!(mv.material in mapa)) return;
      mapa[mv.material] += mv.tipo === "Entrada" ? Number(mv.quantidade) || 0 : -(Number(mv.quantidade) || 0);
    });
    return mapa;
  }, [movimentos]);

  const registrarSaida = (material, quantidade, motivo) => {
    if (!quantidade || Number(quantidade) <= 0) return;
    onChange([...(movimentos || []), { id: uid(), data: new Date().toISOString().slice(0, 10), material, tipo: "Saída", quantidade: Number(quantidade), motivo: motivo || "Uso na produção" }]);
    setRegistrandoSaida(null);
  };

  // Excluir um movimento já "devolve" o valor sozinho — o saldo é sempre
  // recalculado a partir da lista de movimentos, então tirar uma Saída daqui
  // aumenta o saldo de volta, e tirar uma Entrada reduz, sem precisar de
  // nenhum ajuste manual extra.
  const excluirMovimento = (id) => {
    onChange((movimentos || []).filter((mv) => mv.id !== id));
    setExcluindo(null);
  };

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Insumos" title="Estoque de Materiais" />
      <div className="tl-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "26px" }}>
        {MATERIAIS_ESTOCADOS.map((m) => {
          const saldo = saldoPorMaterial[m] || 0;
          return (
            <div key={m} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px" }}>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "6px" }}>{m}</div>
              <div className="tl-display" style={{ fontSize: "26px", fontWeight: 800, color: saldo <= 0 ? "var(--danger)" : "var(--text-primary)" }}>
                {saldo.toFixed(2)} <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-faint)" }}>{UNIDADE_POR_MATERIAL[m]}</span>
              </div>
              <button
                onClick={() => setRegistrandoSaida(m)}
                className="tl-focus"
                style={{ marginTop: "10px", background: "none", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "5px 10px", fontSize: "11.5px", color: "var(--text-muted)", cursor: "pointer" }}
              >
                Registrar saída/uso
              </button>
            </div>
          );
        })}
      </div>

      <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>Histórico de movimentos</h4>
      {(!movimentos || movimentos.length === 0) ? (
        <EmptyState icon={Boxes} title="Nenhum movimento de estoque ainda" hint="Toda compra de material já lança entrada aqui sozinha." />
      ) : (
        <Table
          columns={["Data", "Material", "Tipo", "Quantidade", "Motivo", ""]}
          rows={[...movimentos].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data))).slice(0, 100).map((mv) => (
            <tr key={mv.id} style={rowStyle}>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(mv.data)}</td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{mv.material}</td>
              <td style={tdStyle}>
                <span className="tl-mono" style={{ fontSize: "11px", fontWeight: 700, color: mv.tipo === "Entrada" ? "var(--success)" : "var(--danger)" }}>{mv.tipo === "Entrada" ? "▲ ENTRADA" : "▼ SAÍDA"}</span>
              </td>
              <td style={tdStyle} className="tl-mono">{mv.quantidade} {UNIDADE_POR_MATERIAL[mv.material]}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{mv.motivo || "-"}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <button type="button" onClick={() => setExcluindo(mv)} className="tl-focus" style={{ ...iconBtnStyle, color: "var(--danger)" }} title="Excluir movimento (devolve o valor pro estoque)">
                  <X size={13} />
                </button>
              </td>
            </tr>
          ))}
        />
      )}

      {registrandoSaida && (
        <RegistrarSaidaModal material={registrandoSaida} onConfirm={registrarSaida} onCancel={() => setRegistrandoSaida(null)} />
      )}
      {excluindo && (
        <ConfirmDelete
          label={`o movimento de ${excluindo.tipo.toLowerCase()} de ${excluindo.material} (${excluindo.quantidade} ${UNIDADE_POR_MATERIAL[excluindo.material]})`}
          dados={excluindo}
          onConfirm={() => excluirMovimento(excluindo.id)}
          onCancel={() => setExcluindo(null)}
        />
      )}
    </div>
  );
}

function RegistrarSaidaModal({ material, onConfirm, onCancel }) {
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  return (
    <Modal title={`Registrar saída — ${material}`} onClose={onCancel}>
      <Field label={`Quantidade (${UNIDADE_POR_MATERIAL[material]})`}>
        <Input type="number" min="0" step="0.01" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      </Field>
      <Field label="Motivo (opcional)">
        <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: uso na produção do dia" />
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onConfirm(material, quantidade, motivo)}>Confirmar saída</Button>
      </div>
    </Modal>
  );
}

const emptyBombaConcreto = () => ({
  id: uid(),
  pedido: "",
  data: new Date().toISOString().slice(0, 10),
  empresa: "", // empresa terceirizada da bomba, ou "Própria"
  motorista: "",
  placa: "",
  valorCobrado: "", // o que se cobra do cliente
  valorPago: "", // o que se paga pra empresa terceirizada (se houver)
  status: "EM ABERTO",
  formaPagamento: "",
});

function BombaConcretoModule({ registros, clienteByPedido, onChange }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const salvar = (registro) => {
    const jaExiste = registros.some((r) => r.id === registro.id);
    onChange(jaExiste ? registros.map((r) => (r.id === registro.id ? registro : r)) : [...registros, registro]);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(registros.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const totalCobrado = registros.reduce((s, r) => s + numeroSeguro(r.valorCobrado), 0);
  const totalPago = registros.reduce((s, r) => s + numeroSeguro(r.valorPago), 0);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Serviço"
        title="Bomba de Concreto"
        action={<Button icon={Plus} onClick={() => setEditing(emptyBombaConcreto())}>Novo lançamento</Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px", maxWidth: "700px" }}>
        <MiniStat label="Cobrado do cliente" valor={money(totalCobrado)} cor="var(--success)" />
        <MiniStat label="Pago à empresa da bomba" valor={money(totalPago)} cor="var(--danger)" />
        <MiniStat label="Margem" valor={money(totalCobrado - totalPago)} />
      </div>
      {registros.length === 0 ? (
        <EmptyState icon={Droplet} title="Nenhum lançamento de bomba ainda" />
      ) : (
        <Table
          columns={["Pedido", "Data", "Cliente", "Empresa/Bomba", "Motorista", "Placa", "Cobrado", "Pago", "Status", ""]}
          rows={[...registros].sort((a, b) => dataOrdenavel(b.data).localeCompare(dataOrdenavel(a.data))).map((r) => {
            const cliente = clienteByPedido.get(String(r.pedido).trim());
            return (
              <tr key={r.id} style={rowStyle}>
                <td style={tdStyle}><PedidoStub n={r.pedido} /></td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{cliente ? cliente.nome : r.cliente || "-"}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.empresa || "-"}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.motorista || "-"}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.placa || "-"}</td>
                <td style={tdStyle} className="tl-mono">{money(r.valorCobrado)}</td>
                <td style={tdStyle} className="tl-mono">{money(r.valorPago)}</td>
                <td style={tdStyle}><StatusBadge status={r.status} /></td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <RowActions onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />
                </td>
              </tr>
            );
          })}
        />
      )}
      {editing && (
        <BombaConcretoForm initial={editing} clienteByPedido={clienteByPedido} onSave={salvar} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDelete label={`o lançamento de bomba do pedido nº ${deleting.pedido}`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

function BombaConcretoForm({ initial, clienteByPedido, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const matched = form.pedido ? clienteByPedido.get(String(form.pedido).trim()) : null;

  return (
    <Modal title={initial.pedido ? "Editar bomba de concreto" : "Novo lançamento de bomba"} onClose={onClose} wide>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Nº do pedido" required>
            <Input value={form.pedido} onChange={set("pedido")} required />
          </Field>
          <Field label="Data">
            <Input type="date" value={form.data} onChange={set("data")} />
          </Field>
        </div>
        {form.pedido && (
          <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "9px 12px", marginBottom: "16px", fontSize: "13px" }}>
            {matched ? (
              <>
                <span style={{ fontWeight: 600 }}>{matched.nome}</span>
                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>{enderecoCompleto(matched) || "Endereço não cadastrado"}</div>
              </>
            ) : (
              <span style={{ color: "var(--text-faint)" }}>Nenhum cliente cadastrado com esse pedido</span>
            )}
          </div>
        )}
        <Field label="Empresa da bomba" hint='Coloca "Própria" se for equipamento da sua empresa'>
          <Input value={form.empresa} onChange={set("empresa")} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Motorista">
            <Input value={form.motorista} onChange={set("motorista")} />
          </Field>
          <Field label="Placa">
            <Input value={form.placa} onChange={set("placa")} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Valor cobrado do cliente (R$)">
            <Input type="number" min="0" step="0.01" value={form.valorCobrado} onChange={set("valorCobrado")} />
          </Field>
          <Field label="Valor pago à empresa da bomba (R$)" hint="Deixa em branco se for bomba própria">
            <Input type="number" min="0" step="0.01" value={form.valorPago} onChange={set("valorPago")} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              {Object.keys(STATUS_STYLES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Forma de pagamento">
            <Input value={form.formaPagamento} onChange={set("formaPagamento")} placeholder="Ex: PIX, boleto" />
          </Field>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}

function CalculadoraModule({ cubicagens, clienteByPedido, onChange }) {
  const [pedido, setPedido] = useState("");
  const [elementos, setElementos] = useState([emptyElementoConcreto()]);
  const [percentualPerda, setPercentualPerda] = useState("5");
  const [capacidadeCaminhao, setCapacidadeCaminhao] = useState("8");
  const [salvo, setSalvo] = useState(false);

  // Se o pedido digitado já tiver uma cubicagem salva, carrega ela sozinho
  // — assim reabrir o mesmo pedido depois traz o cálculo de volta.
  useEffect(() => {
    if (!pedido.trim()) return;
    const existente = (cubicagens || []).find((c) => String(c.pedido).trim() === pedido.trim());
    if (existente) {
      setElementos(existente.elementos.length > 0 ? existente.elementos : [emptyElementoConcreto()]);
      setPercentualPerda(existente.percentualPerda);
      setCapacidadeCaminhao(existente.capacidadeCaminhao);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido]);

  const clienteDoPedido = pedido.trim() ? clienteByPedido.get(pedido.trim()) : null;

  const setElemento = (id, k, v) => setElementos(elementos.map((el) => (el.id === id ? { ...el, [k]: v } : el)));
  const addElemento = () => setElementos([...elementos, emptyElementoConcreto()]);
  const removeElemento = (id) => setElementos(elementos.length > 1 ? elementos.filter((el) => el.id !== id) : elementos);

  const volumePorElemento = (el) => (Number(el.comprimento) || 0) * (Number(el.largura) || 0) * (Number(el.altura) || 0) * (Number(el.quantidade) || 1);
  const volumeBruto = elementos.reduce((s, el) => s + volumePorElemento(el), 0);
  const perda = Number(percentualPerda) || 0;
  const volumeComPerda = volumeBruto * (1 + perda / 100);
  const capacidade = Number(capacidadeCaminhao) || 0;
  const viagens = capacidade > 0 ? Math.ceil(volumeComPerda / capacidade) : 0;

  const salvarNoPedido = () => {
    if (!pedido.trim()) return;
    const alvo = pedido.trim();
    const registro = { id: uid(), pedido: alvo, elementos, percentualPerda, capacidadeCaminhao, volumeComPerda, atualizadoEm: new Date().toISOString() };
    const existente = (cubicagens || []).find((c) => String(c.pedido).trim() === alvo);
    const novaLista = existente
      ? (cubicagens || []).map((c) => (c.pedido === existente.pedido ? { ...registro, id: existente.id } : c))
      : [...(cubicagens || []), registro];
    onChange(novaLista);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Planejamento de obra" title="Cubicagem de Concretagem" action={<Button icon={Plus} onClick={addElemento}>Adicionar elemento</Button>} />
      <p style={{ fontSize: "12.5px", color: "var(--text-faint)", marginBottom: "16px", maxWidth: "620px" }}>
        Some o volume de concreto de cada elemento da obra (laje, viga, pilar, sapata...) e veja o total necessário, já considerando uma margem de perda e quantas viagens de caminhão-betoneira isso representa.
      </p>

      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "16px 18px", marginBottom: "20px", maxWidth: "620px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0 16px", alignItems: "flex-end" }}>
          <Field label="Nº do pedido" hint="Vincula esse cálculo ao pedido — digite um já existente pra recarregar o cálculo salvo">
            <Input value={pedido} onChange={(e) => setPedido(e.target.value)} placeholder="Ex: 620" />
          </Field>
          <Button type="button" icon={Save} disabled={!pedido.trim()} onClick={salvarNoPedido} style={{ marginBottom: "16px" }}>
            {salvo ? "Salvo!" : "Salvar no pedido"}
          </Button>
        </div>
        {clienteDoPedido && (
          <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
            Cliente: <strong style={{ color: "var(--text-primary)" }}>{clienteDoPedido.nome}</strong>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px", maxWidth: "920px" }}>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "18px" }}>
          <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "14px" }}>Elementos da obra (dimensões em metros)</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {elementos.map((el, i) => (
              <div key={el.id} style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "7px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>Elemento {i + 1}</span>
                  {elementos.length > 1 && (
                    <button type="button" onClick={() => removeElemento(el.id)} className="tl-focus" style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "2px" }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "0 10px" }}>
                  <Field label="Tipo">
                    <Select value={el.tipo} onChange={(e) => setElemento(el.id, "tipo", e.target.value)}>
                      {TIPOS_ELEMENTO_CONCRETO.map((t) => <option key={t}>{t}</option>)}
                    </Select>
                  </Field>
                  <Field label="Descrição (opcional)" hint="Ex: Laje do 2º pavimento">
                    <Input value={el.descricao} onChange={(e) => setElemento(el.id, "descricao", e.target.value)} />
                  </Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.8fr", gap: "0 10px" }}>
                  <Field label="Comprimento">
                    <Input type="number" min="0" step="0.01" value={el.comprimento} onChange={(e) => setElemento(el.id, "comprimento", e.target.value)} />
                  </Field>
                  <Field label="Largura">
                    <Input type="number" min="0" step="0.01" value={el.largura} onChange={(e) => setElemento(el.id, "largura", e.target.value)} />
                  </Field>
                  <Field label="Altura/Espessura">
                    <Input type="number" min="0" step="0.01" value={el.altura} onChange={(e) => setElemento(el.id, "altura", e.target.value)} />
                  </Field>
                  <Field label="Qtd. iguais">
                    <Input type="number" min="1" value={el.quantidade} onChange={(e) => setElemento(el.id, "quantidade", e.target.value)} />
                  </Field>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-faint)", textAlign: "right" }}>
                  Volume desse elemento: <strong style={{ color: "var(--text-muted)" }}>{volumePorElemento(el).toFixed(3)} m³</strong>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", marginTop: "16px" }}>
            <Field label="Margem de perda (%)" hint="Sobra técnica comum de concretagem">
              <Input type="number" min="0" value={percentualPerda} onChange={(e) => setPercentualPerda(e.target.value)} />
            </Field>
            <Field label="Capacidade do caminhão-betoneira (m³)">
              <Input type="number" min="0" step="0.5" value={capacidadeCaminhao} onChange={(e) => setCapacidadeCaminhao(e.target.value)} />
            </Field>
          </div>
        </div>

        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "9px", padding: "18px", alignSelf: "flex-start" }}>
          <h4 className="tl-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "14px" }}>Resultado</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-faint)" }}>Volume total (sem perda)</div>
              <div className="tl-display" style={{ fontSize: "24px", fontWeight: 700 }}>{volumeBruto.toFixed(3)} m³</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-faint)" }}>Volume com margem de perda ({perda}%)</div>
              <div className="tl-display" style={{ fontSize: "24px", fontWeight: 700, color: "var(--amber)" }}>{volumeComPerda.toFixed(3)} m³</div>
            </div>
            <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "14px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-faint)" }}>Viagens de caminhão-betoneira necessárias</div>
              <div className="tl-display" style={{ fontSize: "36px", fontWeight: 800, color: "var(--success)" }}>{viagens}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Checklist de vistoria de máquina                                    */
/* ------------------------------------------------------------------ */
const CHECKLIST_SECOES = [
  {
    titulo: "Condições do operador",
    itens: [
      "O operador é qualificado?",
      "Possui carteira de habilitação C, D ou E?",
      "Há comprovação de que fez treinamento?",
      "Utiliza os equipamentos de EPI necessários?",
      "O assento do operador está em boas condições?",
      "Está usando alguma medicação que impeça operar máquinas pesadas?",
    ],
  },
  {
    titulo: "Sistema elétrico",
    itens: [
      "Os faróis dianteiro e traseiro funcionam?",
      "A luz de freio funciona?",
      "O sistema de partida opera com facilidade?",
      "Os instrumentos do painel funcionam?",
      "A bateria se encontra em boas condições?",
      "Existe alarme de ré e funciona?",
      "A buzina também funciona?",
    ],
  },
  {
    titulo: "Sistema hidráulico",
    itens: [
      "Existe fixação e boas condições de mangueiras?",
      "Ocorre vazamento de óleo hidráulico?",
      "O nível do óleo hidráulico está dentro do ideal?",
      "Há vazamento de óleo de motor?",
      "Existe vazamento de óleo diesel?",
      "A fixação dos cilindros hidráulicos está ok?",
      "Pinos e contrapinos dos cilindros hidráulicos estão seguros?",
    ],
  },
  {
    titulo: "Vistoria geral",
    itens: [
      "Existem trincas na estrutura?",
      "Há fixação do suporte do escarificador?",
      "Pinos e contrapinos de lança estão presentes e seguros?",
      "Pinos e contrapinos de concha também estão?",
      "O freio de giro operante funciona?",
      "Tem presença de extintor de incêndio?",
      "Está dentro da validade?",
      "Foi verificada a condição dos roletes?",
      "Existe algum tipo de vazamento?",
      "Há danos na pintura ou na lataria?",
      "Os retrovisores laterais estão em bom estado?",
    ],
  },
];

const emptyChecklist = () => ({
  id: uid(),
  equipamento: "",
  descricaoItem: "",
  dataEntrada: new Date().toISOString().slice(0, 10),
  dataSaida: "",
  nomeEmpresa: "",
  nomeMotorista: "",
  modelo: "",
  anoFabricacao: "",
  numeroSerie: "",
  respostas: {},
  observacoes: {},
});



// Cubicagem de uma estaca: volume do cilindro (π × raio² × profundidade).
// Diâmetro vem em cm, profundidade em metros — o resultado sai em m³.
const cubicagemEstaca = (diametroCm, profundidadeM) => {
  const d = numeroSeguro(diametroCm);
  const p = numeroSeguro(profundidadeM);
  if (!d || !p) return 0;
  const raioM = d / 100 / 2;
  return Math.PI * raioM * raioM * p;
};

const emptyEstaca = () => ({
  id: uid(),
  pedido: "",
  numero: "",
  profundidade: "",
  diametro: "",
  status: "Pendente",
  operador: "",
  maquinaId: "",
  dataExecucao: "",
  observacao: "",
});

const CATEGORIAS_DESPESA = ["Funcionários", "Aluguel", "Água", "Luz", "Internet/Telefone", "Combustível", "Material/Insumos", "Outras"];

const emptyDespesa = () => ({
  id: uid(),
  categoria: "Outras",
  descricao: "",
  valor: "",
  vencimento: "",
  dataPagamento: "",
  status: "Pendente",
  recorrente: false,
  observacao: "",
});

// 5º dia útil do mês (pula sábado e domingo) — usado como vencimento
// sugerido pro pagamento do Salário. Não desconta feriados.
const quintoDiaUtil = (ano, mesIndex) => {
  let data = new Date(ano, mesIndex, 1);
  let uteis = 0;
  while (uteis < 5) {
    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) uteis++;
    if (uteis < 5) data.setDate(data.getDate() + 1);
  }
  return data.toISOString().slice(0, 10);
};

// Sugere a data de vencimento certa pra cada tipo — Vale sempre no dia 20
// do mês de referência, Salário no 5º dia útil do mês SEGUINTE (já que o
// salário fecha depois que o mês termina).
const vencimentoSugerido = (mesReferencia, tipoPagamento) => {
  const [ano, mes] = mesReferencia.split("-").map(Number);
  if (tipoPagamento === "Vale") {
    return `${mesReferencia}-20`;
  }
  const proximoMes = new Date(ano, mes, 1); // mes já é 1-indexado, então "mes" aqui = mês seguinte (0-indexado)
  return quintoDiaUtil(proximoMes.getFullYear(), proximoMes.getMonth());
};

const emptyFolhaItem = (mesReferencia, nome = "", tipoPagamento = "Salário") => ({
  id: uid(),
  funcionario: nome,
  mesReferencia,
  tipoPagamento,
  vencimento: vencimentoSugerido(mesReferencia, tipoPagamento),
  salarioBase: "",
  valeTransporte: "",
  valeAlimentacao: "",
  ajudaCusto: "",
  premiacao: "",
  desconto: "",
  observacao: "",
  status: "Pendente",
  dataPagamento: "",
});

const valorLiquidoFolha = (item) =>
  numeroSeguro(item.salarioBase) +
  numeroSeguro(item.valeTransporte) +
  numeroSeguro(item.valeAlimentacao) +
  numeroSeguro(item.ajudaCusto) +
  numeroSeguro(item.premiacao) -
  numeroSeguro(item.desconto);

function FolhaPagamentoModule({ folha, onChange, financeiro, onChangeFinanceiro, funcionarios }) {
  const hojeISO = new Date().toISOString().slice(0, 10);
  const mesAtual = hojeISO.slice(0, 7);
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [verRelatorio, setVerRelatorio] = useState(false);

  const mesesExistentes = useMemo(() => [...new Set(folha.map((f) => f.mesReferencia))].sort().reverse(), [folha]);
  const itensDoMes = folha
    .filter((f) => f.mesReferencia === mesSelecionado)
    .sort((a, b) => a.funcionario.localeCompare(b.funcionario) || a.tipoPagamento.localeCompare(b.tipoPagamento));

  const totalMes = itensDoMes.reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalPago = itensDoMes.filter((f) => f.status === "Pago").reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalPendente = totalMes - totalPago;
  const totalVale = itensDoMes.filter((f) => f.tipoPagamento === "Vale").reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalSalario = itensDoMes.filter((f) => f.tipoPagamento === "Salário").reduce((s, f) => s + valorLiquidoFolha(f), 0);

  // Cada item da folha, quando pago, gera/atualiza uma despesa (categoria
  // Funcionários) — que por sua vez já aparece em Contas a Pagar, do
  // mesmo jeito que já fizemos com as Despesas Fixas.
  const sincronizarDespesa = (item, financeiroBase) => {
    if (!financeiro || !onChangeFinanceiro) return;
    const existente = financeiroBase.find((c) => c.folhaId === item.id);
    const nomeMes = new Date(`${item.mesReferencia}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    const contaAtualizada = {
      id: existente?.id || uid(),
      folhaId: item.id,
      tipo: "Pagar",
      descricao: `Funcionários — ${item.funcionario} — ${item.tipoPagamento} (${nomeMes})`,
      fornecedor: "Funcionários",
      pedido: "",
      valor: valorLiquidoFolha(item),
      vencimento: item.vencimento || vencimentoSugerido(item.mesReferencia, item.tipoPagamento),
      dataPagamento: item.status === "Pago" ? item.dataPagamento || hojeISO : "",
      status: item.status === "Pago" ? "Pago" : "Pendente",
      formaPagamento: existente?.formaPagamento || "",
    };
    onChangeFinanceiro(existente ? financeiroBase.map((c) => (c.id === existente.id ? contaAtualizada : c)) : [...financeiroBase, contaAtualizada]);
  };

  const save = (item) => {
    const exists = folha.some((f) => f.id === item.id);
    const novaLista = exists ? folha.map((f) => (f.id === item.id ? item : f)) : [...folha, item];
    onChange(novaLista);
    sincronizarDespesa(item, financeiro || []);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(folha.filter((f) => f.id !== id));
    if (financeiro && onChangeFinanceiro) {
      onChangeFinanceiro(financeiro.filter((c) => c.folhaId !== id));
    }
    setDeleting(null);
  };
  const marcarPago = (item) => {
    const atualizado = { ...item, status: "Pago", dataPagamento: item.dataPagamento || hojeISO };
    onChange(folha.map((f) => (f.id === item.id ? atualizado : f)));
    sincronizarDespesa(atualizado, financeiro || []);
  };

  // "Gerar novo mês": pra cada funcionário cadastrado (ou já usado antes,
  // se ainda não tiver cadastro), cria os dois lançamentos do mês — Vale
  // (dia 20) e Salário (5º dia útil do mês seguinte) — copiando os valores
  // fixos do lançamento anterior do mesmo tipo, zerando desconto/premiação.
  const gerarNovoMes = () => {
    const proximoMes = new Date();
    proximoMes.setDate(1);
    const mesReferencia = proximoMes.toISOString().slice(0, 7);
    if (folha.some((f) => f.mesReferencia === mesReferencia)) {
      setMesSelecionado(mesReferencia);
      setGerando(false);
      return;
    }

    const nomesFuncionarios =
      funcionarios && funcionarios.length > 0
        ? funcionarios.map((f) => f.nome)
        : [...new Set(folha.map((f) => f.funcionario))];

    const novosItens = [];
    nomesFuncionarios.forEach((nome) => {
      ["Vale", "Salário"].forEach((tipo) => {
        const anterior = [...folha]
          .filter((f) => f.funcionario === nome && f.tipoPagamento === tipo)
          .sort((a, b) => b.mesReferencia.localeCompare(a.mesReferencia))[0];
        novosItens.push({
          ...emptyFolhaItem(mesReferencia, nome, tipo),
          salarioBase: anterior?.salarioBase || "",
          valeTransporte: anterior?.valeTransporte || "",
          valeAlimentacao: anterior?.valeAlimentacao || "",
          ajudaCusto: anterior?.ajudaCusto || "",
        });
      });
    });

    onChange([...folha, ...novosItens]);
    setMesSelecionado(mesReferencia);
    setGerando(false);
  };

  const nomeMesSelecionado = new Date(`${mesSelecionado}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Operação"
        title="Folha de Pagamento"
        action={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button icon={FileText} variant="subtle" onClick={() => setVerRelatorio(true)}>Relatório mensal</Button>
            <Button icon={Copy} variant="subtle" onClick={gerarNovoMes}>Gerar mês atual</Button>
            <Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("folha", () => emptyFolhaItem(mesSelecionado)))}>Novo funcionário</Button>
          </div>
        }
      />

      <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "18px", flexWrap: "wrap" }}>
        <Field label="Mês de referência">
          <Select value={mesSelecionado} onChange={(e) => setMesSelecionado(e.target.value)} style={{ width: "200px" }}>
            {!mesesExistentes.includes(mesSelecionado) && <option value={mesSelecionado}>{nomeMesSelecionado}</option>}
            {mesesExistentes.map((m) => (
              <option key={m} value={m}>{new Date(`${m}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <MiniStat label="Total da folha" valor={money(totalMes)} />
        <MiniStat label="Já pago" valor={money(totalPago)} cor="var(--success)" />
        <MiniStat label="Pendente" valor={money(totalPendente)} cor="var(--amber)" />
        <MiniStat label="Vale (dia 20)" valor={money(totalVale)} cor="#B98FE8" />
        <MiniStat label="Salário (5º dia útil)" valor={money(totalSalario)} cor="#6FA3D6" />
      </div>

      {itensDoMes.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="Nenhum funcionário nesse mês ainda"
          hint={mesesExistentes.length > 0 ? "Clique em \"Gerar mês atual\" pra copiar do mês anterior, ou adicione um funcionário novo." : "Comece adicionando o primeiro funcionário."}
        />
      ) : (
        <Table
          columns={["Funcionário", "Tipo", "Vencimento", "Líquido", "Status", ""]}
          rows={itensDoMes.map((f) => {
            const atrasado = f.status !== "Pago" && f.vencimento && dataOrdenavel(f.vencimento) < hojeISO;
            return (
              <tr key={f.id} style={rowStyle}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{f.funcionario}</td>
                <td style={tdStyle}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: f.tipoPagamento === "Vale" ? "#3D2B54" : "#2C3F55", color: f.tipoPagamento === "Vale" ? "#CBA6F2" : "#8CBCE8" }}>
                    {f.tipoPagamento}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: atrasado ? "var(--danger)" : "var(--text-muted)" }}>{fmtDate(f.vencimento)}</td>
                <td style={{ ...tdStyle, fontWeight: 700 }} className="tl-mono">{money(valorLiquidoFolha(f))}</td>
                <td style={tdStyle}>
                  {f.status === "Pago" ? (
                    <StatusBadge status="PAGO" />
                  ) : (
                    <button onClick={() => marcarPago(f)} className="tl-focus" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} title="Clique pra marcar como pago">
                      <StatusBadge status={atrasado ? "CANCELADO" : "EM ABERTO"} />
                    </button>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <RowActions onEdit={() => setEditing(f)} onDelete={() => setDeleting(f)} />
                </td>
              </tr>
            );
          })}
        />
      )}

      {editing && <FolhaItemForm initial={editing} onSave={save} onClose={() => setEditing(null)} funcionarios={funcionarios} />}
      {deleting && (
        <ConfirmDelete label={`o lançamento de "${deleting.funcionario}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
      {verRelatorio && (
        <RelatorioMensalFolha mes={mesSelecionado} itens={itensDoMes} onClose={() => setVerRelatorio(false)} />
      )}
    </div>
  );
}

function RelatorioMensalFolha({ mes, itens, onClose }) {
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [aviso, setAviso] = useState("");

  const nomeMes = new Date(`${mes}-01T00:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const totalGeral = itens.reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalPago = itens.filter((f) => f.status === "Pago").reduce((s, f) => s + valorLiquidoFolha(f), 0);
  const totalPendente = totalGeral - totalPago;

  const porFuncionario = useMemo(() => {
    const mapa = new Map();
    itens.forEach((f) => {
      if (!mapa.has(f.funcionario)) mapa.set(f.funcionario, []);
      mapa.get(f.funcionario).push(f);
    });
    return [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [itens]);

  const enviar = async () => {
    setGerandoPdf(true);
    setAviso("");
    const blob = await gerarPdfFolhaPagamento(mes, itens);
    setGerandoPdf(false);

    const texto =
      `*Relatório de Folha de Pagamento — ${nomeMes}*\n\n` +
      `Funcionários: ${porFuncionario.length}\n` +
      `Total da folha: ${money(totalGeral)}\n` +
      `Já pago: ${money(totalPago)}\n` +
      `Pendente: ${money(totalPendente)}\n\n${PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}`;

    if (!blob) {
      setAviso("Geração de PDF não disponível nesta pré-visualização — no site publicado, este botão manda o documento com a logo.");
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
      return;
    }

    const fileName = `folha-pagamento-${mes}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (ehCelular && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Folha de Pagamento - ${nomeMes}`, text: PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa" });
        return;
      } catch (e) {
        /* segue pro download abaixo */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.alert(`PDF baixado como "${fileName}" (confira a pasta Downloads).\n\nO WhatsApp vai abrir agora só com o texto — anexe esse arquivo baixado na conversa antes de enviar.`);
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
    setAviso("PDF baixado e WhatsApp aberto — é só anexar o arquivo baixado na conversa.");
  };

  return (
    <Modal title={`Relatório mensal — ${nomeMes}`} onClose={onClose} wide>
      <div className="tl-print-area" style={{ background: "#fff", color: "#1a1a1a", borderRadius: "6px", padding: "28px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #1a1a1a", paddingBottom: "14px", marginBottom: "20px" }}>
          <img src={LOGO_DATA_URI()} alt="" style={{ width: "44px", height: "44px", borderRadius: "6px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "19px" }}>{PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{[PREFS_ATUAL_REF?.cnpjEmpresa ? `CNPJ: ${PREFS_ATUAL_REF.cnpjEmpresa}` : "", PREFS_ATUAL_REF?.enderecoEmpresa || ""].filter(Boolean).join(" — ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", textTransform: "capitalize" }}>FOLHA DE PAGAMENTO</div>
            <div style={{ fontSize: "11px", color: "#555", textTransform: "capitalize" }}>{nomeMes}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          <div style={{ background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10.5px", color: "#777" }}>TOTAL DA FOLHA</div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>{money(totalGeral)}</div>
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10.5px", color: "#777" }}>JÁ PAGO</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#2e7d32" }}>{money(totalPago)}</div>
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10.5px", color: "#777" }}>PENDENTE</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#c77700" }}>{money(totalPendente)}</div>
          </div>
        </div>

        {porFuncionario.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#777" }}>Nenhum lançamento nesse mês ainda.</p>
        ) : (
          porFuncionario.map(([nome, lancamentos]) => {
            const totalFuncionario = lancamentos.reduce((s, f) => s + valorLiquidoFolha(f), 0);
            return (
              <div key={nome} style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "13.5px" }}>{nome} — {money(totalFuncionario)}</strong>
                {lancamentos.map((f) => (
                  <div key={f.id} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
                    <ReportRow
                      label={`${f.tipoPagamento} — vencimento ${fmtDate(f.vencimento)} (${f.status})`}
                      value={<strong>{money(valorLiquidoFolha(f))}</strong>}
                    />
                    <div style={{ fontSize: "11px", color: "#777", paddingLeft: "4px" }}>
                      Salário: {money(f.salarioBase)} · Vale transp.: {money(f.valeTransporte)} · Vale alim.: {money(f.valeAlimentacao)} · Ajuda de custo: {money(f.ajudaCusto)}
                      {numeroSeguro(f.premiacao) > 0 && ` · Premiação: +${money(f.premiacao)}`}
                      {numeroSeguro(f.desconto) > 0 && ` · Desconto: -${money(f.desconto)}`}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={onClose}>Fechar</Button>
        <Button
          variant="subtle"
          icon={MessageCircle}
          disabled={gerandoPdf}
          style={{ background: "#25D366", color: "#fff", borderColor: "#25D366", fontWeight: 700 }}
          onClick={enviar}
        >
          {gerandoPdf ? "Gerando PDF..." : "WhatsApp"}
        </Button>
        <Button icon={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      {aviso && <p style={{ fontSize: "12.5px", color: "var(--amber)", marginTop: "10px", textAlign: "right" }}>{aviso}</p>}
    </Modal>
  );
}

function FolhaItemForm({ initial, onSave, onClose, funcionarios }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const liquido = valorLiquidoFolha(form);

  useEffect(() => {
    salvarRascunho("folha", form);
  }, [form]);

  // Muda o mês ou o tipo (Vale/Salário) e a data de vencimento sugerida se
  // atualiza sozinha — mas só se o usuário ainda não tiver mexido nela.
  const setMesOuTipo = (k) => (e) => {
    const novoForm = { ...form, [k]: e.target.value };
    novoForm.vencimento = vencimentoSugerido(novoForm.mesReferencia, novoForm.tipoPagamento);
    setForm(novoForm);
  };

  return (
    <Modal title={initial.funcionario ? "Editar lançamento" : "Novo funcionário na folha"} onClose={() => { limparRascunho("folha"); onClose(); }}>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form onSubmit={(e) => { e.preventDefault(); limparRascunho("folha"); onSave(form); }}>
        <Field label="Nome do funcionário" required>
          {funcionarios && funcionarios.length > 0 ? (
            <Select value={form.funcionario} onChange={set("funcionario")} required>
              <option value="">Selecione...</option>
              {porNome(funcionarios).map((f) => (
                <option key={f.id} value={f.nome}>{f.nome}</option>
              ))}
              {form.funcionario && !funcionarios.some((f) => f.nome === form.funcionario) && (
                <option value={form.funcionario}>{form.funcionario}</option>
              )}
            </Select>
          ) : (
            <Input value={form.funcionario} onChange={set("funcionario")} placeholder="Ex: João da Silva" required />
          )}
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Mês de referência">
            <Input type="month" value={form.mesReferencia} onChange={setMesOuTipo("mesReferencia")} />
          </Field>
          <Field label="Tipo de pagamento">
            <Select value={form.tipoPagamento} onChange={setMesOuTipo("tipoPagamento")}>
              <option value="Vale">Vale (dia 20)</option>
              <option value="Salário">Salário (5º dia útil)</option>
            </Select>
          </Field>
        </div>
        <Field label="Data de vencimento" hint="Sugerida automaticamente — pode ajustar se precisar">
          <Input type="date" value={form.vencimento} onChange={set("vencimento")} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Salário base (R$)">
            <Input type="number" step="0.01" value={form.salarioBase} onChange={set("salarioBase")} />
          </Field>
          <Field label="Vale transporte (R$)">
            <Input type="number" step="0.01" value={form.valeTransporte} onChange={set("valeTransporte")} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Vale alimentação (R$)">
            <Input type="number" step="0.01" value={form.valeAlimentacao} onChange={set("valeAlimentacao")} />
          </Field>
          <Field label="Ajuda de custo (R$)">
            <Input type="number" step="0.01" value={form.ajudaCusto} onChange={set("ajudaCusto")} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Premiação (R$)" hint="Soma no total">
            <Input type="number" step="0.01" value={form.premiacao} onChange={set("premiacao")} />
          </Field>
          <Field label="Desconto (R$)" hint="Subtrai — ex: vale já adiantado, falta">
            <Input type="number" step="0.01" value={form.desconto} onChange={set("desconto")} />
          </Field>
        </div>

        <div style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)", borderRadius: "6px", padding: "10px 12px", marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Valor líquido a pagar</span>
          <strong className="tl-mono">{money(liquido)}</strong>
        </div>

        <Field label="Status">
          <Select value={form.status} onChange={set("status")}>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
          </Select>
        </Field>
        {form.status === "Pago" && (
          <Field label="Data do pagamento">
            <Input type="date" value={form.dataPagamento} onChange={set("dataPagamento")} />
          </Field>
        )}

        <Field label="Observação (opcional)">
          <TextArea value={form.observacao} onChange={set("observacao")} placeholder="Ex: motivo do desconto, motivo da premiação..." />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("folha"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}

function DespesasModule({ despesas, onChange, financeiro, onChangeFinanceiro }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const hojeISO = new Date().toISOString().slice(0, 10);

  // Cada despesa fica amarrada a uma conta a pagar correspondente
  // (via despesaId) — cria na hora se ainda não existir, ou atualiza se já
  // existir. Assim ela aparece automaticamente em Contas a Pagar.
  const sincronizarConta = (despesa, contasBase) => {
    if (!financeiro || !onChangeFinanceiro) return;
    const existente = contasBase.find((c) => c.despesaId === despesa.id);
    const contaAtualizada = {
      id: existente?.id || uid(),
      despesaId: despesa.id,
      tipo: "Pagar",
      descricao: `${despesa.categoria} — ${despesa.descricao}`,
      fornecedor: despesa.categoria,
      pedido: "",
      valor: numeroSeguro(despesa.valor),
      vencimento: despesa.vencimento || "",
      dataPagamento: despesa.status === "Pago" ? despesa.dataPagamento || hojeISO : "",
      status: despesa.status === "Pago" ? "Pago" : "Pendente",
      formaPagamento: existente?.formaPagamento || "",
    };
    onChangeFinanceiro(existente ? contasBase.map((c) => (c.id === existente.id ? contaAtualizada : c)) : [...contasBase, contaAtualizada]);
  };

  const save = (record) => {
    const exists = despesas.some((r) => r.id === record.id);
    onChange(exists ? despesas.map((r) => (r.id === record.id ? record : r)) : [...despesas, record]);
    sincronizarConta(record, financeiro || []);
    setEditing(null);
  };
  const remove = (id) => {
    onChange(despesas.filter((r) => r.id !== id));
    if (financeiro && onChangeFinanceiro) {
      onChangeFinanceiro(financeiro.filter((c) => c.despesaId !== id));
    }
    setDeleting(null);
  };
  const marcarPago = (r) => {
    const atualizada = { ...r, status: "Pago", dataPagamento: r.dataPagamento || hojeISO };
    onChange(despesas.map((d) => (d.id === r.id ? atualizada : d)));
    sincronizarConta(atualizada, financeiro || []);
  };

  const filtradas = despesas.filter((d) => {
    if (filtroCategoria !== "todas" && d.categoria !== filtroCategoria) return false;
    if (filtroStatus === "pendentes" && d.status === "Pago") return false;
    if (filtroStatus === "pagas" && d.status !== "Pago") return false;
    if (filtroStatus === "atrasadas" && !(d.status !== "Pago" && d.vencimento && dataOrdenavel(d.vencimento) < hojeISO)) return false;
    return true;
  });

  const totalPendente = despesas.filter((d) => d.status !== "Pago").reduce((s, d) => s + numeroSeguro(d.valor), 0);
  const totalPagoMes = despesas
    .filter((d) => d.status === "Pago" && (d.dataPagamento || "").slice(0, 7) === hojeISO.slice(0, 7))
    .reduce((s, d) => s + numeroSeguro(d.valor), 0);
  const totalAtrasado = despesas.filter((d) => d.status !== "Pago" && d.vencimento && dataOrdenavel(d.vencimento) < hojeISO).reduce((s, d) => s + numeroSeguro(d.valor), 0);

  const porCategoria = useMemo(() => {
    const mapa = new Map();
    despesas.filter((d) => d.status !== "Pago").forEach((d) => {
      mapa.set(d.categoria, (mapa.get(d.categoria) || 0) + numeroSeguro(d.valor));
    });
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
  }, [despesas]);

  return (
    <div className="tl-fade-in">
      <PageHeader
        eyebrow="Operação"
        title="Despesas Fixas"
        action={<Button icon={Plus} onClick={() => setEditing(abrirNovoRegistro("despesa", emptyDespesa))}>Nova despesa</Button>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <MiniStat label="Em aberto" valor={money(totalPendente)} cor="var(--amber)" />
        <MiniStat label="Pago este mês" valor={money(totalPagoMes)} cor="var(--success)" />
        <MiniStat label="Atrasadas" valor={money(totalAtrasado)} cor="var(--danger)" />
      </div>

      {porCategoria.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {porCategoria.map(([cat, valor]) => (
            <div key={cat} style={{ background: "var(--bg-panel)", border: "1px solid var(--border-soft)", borderRadius: "7px", padding: "8px 12px", fontSize: "12px" }}>
              <span style={{ color: "var(--text-muted)" }}>{cat}:</span> <strong className="tl-mono">{money(valor)}</strong>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={{ width: "180px" }}>
          <option value="todas">Toda categoria</option>
          {CATEGORIAS_DESPESA.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: "160px" }}>
          <option value="todos">Todo status</option>
          <option value="pendentes">Só pendentes</option>
          <option value="pagas">Só pagas</option>
          <option value="atrasadas">Só atrasadas</option>
        </Select>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState icon={Home} title="Nenhuma despesa cadastrada" hint="Cadastre aluguel, água, luz, funcionários e outras contas fixas da empresa." />
      ) : (
        <Table
          columns={["Categoria", "Descrição", "Vencimento", "Valor", "Status", ""]}
          rows={[...filtradas]
            .sort((a, b) => dataOrdenavel(b.vencimento).localeCompare(dataOrdenavel(a.vencimento)))
            .map((d) => {
              const atrasada = d.status !== "Pago" && d.vencimento && dataOrdenavel(d.vencimento) < hojeISO;
              return (
                <tr key={d.id} style={rowStyle}>
                  <td style={tdStyle}>{d.categoria}</td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>
                    {d.descricao || "-"}{d.recorrente && <span title="Recorrente mensal" style={{ marginLeft: "6px", fontSize: "10px", color: "var(--text-faint)" }}>↻</span>}
                  </td>
                  <td style={{ ...tdStyle, color: atrasada ? "var(--danger)" : "var(--text-muted)" }}>{fmtDate(d.vencimento)}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }} className="tl-mono">{money(d.valor)}</td>
                  <td style={tdStyle}>
                    {d.status === "Pago" ? (
                      <StatusBadge status="PAGO" />
                    ) : (
                      <button onClick={() => marcarPago(d)} className="tl-focus" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} title="Clique pra marcar como pago">
                        <StatusBadge status={atrasada ? "CANCELADO" : "EM ABERTO"} />
                      </button>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <RowActions onEdit={() => setEditing(d)} onDelete={() => setDeleting(d)} />
                  </td>
                </tr>
              );
            })}
        />
      )}

      {editing && <DespesaForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDelete label={`a despesa "${deleting.descricao || deleting.categoria}"`} dados={deleting} onConfirm={() => remove(deleting.id)} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

function DespesaForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [rascunhoRecuperado] = useState(() => !!initial.__rascunho);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  useEffect(() => {
    salvarRascunho("despesa", form);
  }, [form]);

  return (
    <Modal title={initial.descricao ? "Editar despesa" : "Nova despesa"} onClose={() => { limparRascunho("despesa"); onClose(); }}>
      {rascunhoRecuperado && <RascunhoBanner />}
      <form onSubmit={(e) => { e.preventDefault(); limparRascunho("despesa"); onSave({ ...form, valor: numeroSeguro(form.valor) }); }}>
        <Field label="Categoria">
          <Select value={form.categoria} onChange={set("categoria")}>
            {CATEGORIAS_DESPESA.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Descrição" required>
          <Input value={form.descricao} onChange={set("descricao")} placeholder="Ex: Salário João, Aluguel do pátio..." required />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Valor (R$)" required>
            <Input type="number" step="0.01" value={form.valor} onChange={set("valor")} required />
          </Field>
          <Field label="Vencimento">
            <Input type="date" value={form.vencimento} onChange={set("vencimento")} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </Select>
          </Field>
          {form.status === "Pago" && (
            <Field label="Data do pagamento">
              <Input type="date" value={form.dataPagamento} onChange={set("dataPagamento")} />
            </Field>
          )}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "14px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.recorrente} onChange={set("recorrente")} />
          Recorrente (repete todo mês — ex: aluguel, água, luz)
        </label>

        <Field label="Observação (opcional)">
          <TextArea value={form.observacao} onChange={set("observacao")} />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <Button type="button" variant="ghost" onClick={() => { limparRascunho("despesa"); onClose(); }}>Cancelar</Button>
          <Button type="submit">Salvar despesa</Button>
        </div>
      </form>
    </Modal>
  );
}








/* ------------------------------------------------------------------ */
/*  Modo Campo — acesso restrito para equipe em obra                    */
/* ------------------------------------------------------------------ */
function CampoShell({ maquinas, manutencoes, controleDiario, onChangeManutencoes, onChangeControleDiario }) {
  const [aba, setAba] = useState("abastecimento");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderBottom: "1px solid var(--border-soft)", background: "var(--bg-panel)" }}>
        <img src={LOGO_DATA_URI()} alt="" style={{ width: "34px", height: "34px", borderRadius: "6px", background: "#F5F2E9" }} />
        <div>
          <div className="tl-display" style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>
            {PREFS_ATUAL_REF?.nomeEmpresa || "Sua Empresa"}
          </div>
          <div className="tl-mono" style={{ fontSize: "9px", color: "var(--text-faint)", marginTop: "2px" }}>ACESSO DE CAMPO</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2px", padding: "10px 14px", background: "var(--bg-panel)", borderBottom: "1px solid var(--border-soft)" }}>
        {[
          { id: "abastecimento", label: "Abastecimento", icon: Fuel },
          { id: "apontamento", label: "Apontamento", icon: Gauge },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setAba(t.id)}
            className="tl-focus"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: aba === t.id ? "var(--bg-panel-raised)" : "transparent",
              color: aba === t.id ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: aba === t.id ? 600 : 500,
            }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: "20px", maxWidth: "700px", margin: "0 auto", width: "100%" }}>
        {aba === "abastecimento" && (
          <CampoAbastecimento maquinas={maquinas} manutencoes={manutencoes} onChange={onChangeManutencoes} />
        )}
        {aba === "apontamento" && (
          <ControleDiarioModule
            registros={controleDiario}
            maquinas={maquinas}
            onChange={onChangeControleDiario}
            isAdmin={false}
            requireAdmin={(action) => action()}
          />
        )}
      </div>
    </div>
  );
}

function CampoAbastecimento({ maquinas, manutencoes, onChange }) {
  const [editing, setEditing] = useState(null);
  const abastecimentos = manutencoes.filter((m) => m.tipo === "Abastecimento");

  const salvar = (r) => {
    onChange([...manutencoes, r]);
    setEditing(null);
  };

  return (
    <div className="tl-fade-in">
      <PageHeader eyebrow="Registro de campo" title="Abastecimento" action={<Button icon={Plus} onClick={() => setEditing({ ...emptyManutencao(), tipo: "Abastecimento" })}>Novo abastecimento</Button>} />

      {abastecimentos.length === 0 ? (
        <EmptyState icon={Fuel} title="Nenhum abastecimento registrado ainda" hint="Registre sempre que abastecer uma máquina." />
      ) : (
        <Table
          columns={["Máquina", "Data", "Litros", "Descrição", ""]}
          rows={[...abastecimentos].sort((a, b) => (b.data || "").localeCompare(a.data || "")).slice(0, 30).map((r) => (
            <tr key={r.id} style={rowStyle}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{maquinas.find((m) => m.id === r.maquinaId)?.nome || "-"}</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{fmtDate(r.data)}</td>
              <td style={tdStyle} className="tl-mono">{r.litros || "-"} L</td>
              <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{r.descricao || "-"}</td>
              <td style={tdStyle}></td>
            </tr>
          ))}
        />
      )}

      {editing && <ManutencaoForm initial={editing} maquinas={maquinas} onSave={salvar} onClose={() => setEditing(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mascote guia — escavadeira animada com tour passo a passo           */
/* ------------------------------------------------------------------ */
const TOUR_PASSOS = [
  {
    titulo: "Oi, eu sou o Escavinho! 👋",
    texto: "Vou te mostrar rapidinho as principais partes do sistema. Você pode pular a qualquer momento, e chamar de novo sempre que quiser clicando em mim, ali no canto.",
  },
  {
    titulo: "Painel",
    texto: "É a tela inicial — mostra os números do dia (pedidos em aberto, propostas, financeiro) e o calendário com as máquinas trabalhando. Clique em qualquer cartão pra ir direto naquela área.",
  },
  {
    titulo: "Clientes e Produção",
    texto: "Em Clientes você cadastra quem contratou o serviço, com um número de pedido. Esse número conecta tudo: em Produção você lança o trabalho feito, e o cliente aparece sozinho.",
  },
  {
    titulo: "Propostas",
    texto: "Pode gerar uma proposta a partir de um pedido já lançado em Produção, ou criar uma do zero. Dá pra imprimir ou mandar por WhatsApp com a logo da empresa.",
  },
  {
    titulo: "Financeiro",
    texto: "Contas a pagar e a receber, com boletos, atrasados e um relatório diário, semanal e mensal. Quando uma conta a receber é marcada como paga, dá pra emitir um recibo pro cliente na hora.",
  },
  {
    titulo: "Agenda e Cubicagem",
    texto: "A Agenda tem um calendário mostrando compromissos e quais máquinas estão em obra em cada dia. A Cubicagem de Concretagem ajuda a calcular o volume de concreto de uma obra e quantas viagens de caminhão-betoneira isso representa.",
  },
  {
    titulo: "Configurações",
    texto: "Aqui você cadastra as pessoas que usam o sistema (com senha individual), acompanha quem entrou e o que foi excluído, ajusta o tema, o tamanho da letra, e cadastra máquinas, operadores e vendedores.",
  },
  {
    titulo: "Pronto! 🎉",
    texto: "É isso — comece explorando, e sempre que tiver dúvida é só clicar em mim de novo. Bom trabalho!",
  },
];

function EscavadeiraAndando() {
  return (
    <div style={{ width: "180px", height: "56px", margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes tlAndar {
          0% { left: -10px; transform: scaleX(1); }
          45% { left: 130px; transform: scaleX(1); }
          50% { left: 130px; transform: scaleX(-1); }
          95% { left: -10px; transform: scaleX(-1); }
          100% { left: -10px; transform: scaleX(1); }
        }
        .tl-andando { animation: tlAndar 3.2s ease-in-out infinite; }
      `}</style>
      <div
        className="tl-andando"
        style={{ position: "absolute", bottom: "6px", width: "60px", transformOrigin: "center" }}
      >
        <Escavadeirinha tamanho={56} />
      </div>
      <div style={{ position: "absolute", bottom: "2px", left: 0, right: 0, height: "2px", background: "var(--border-soft)" }} />
    </div>
  );
}

// Mascote da betoneira, andando de um lado pro outro — usada na tela de
// carregamento, no lugar da escavadeira animada (não fazia mais sentido
// pra uma usina de concreto).
function BetoneiraAndando() {
  return (
    <div style={{ width: "180px", height: "70px", margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes tlAndarBetoneira {
          0% { left: -20px; transform: scaleX(1); }
          45% { left: 110px; transform: scaleX(1); }
          50% { left: 110px; transform: scaleX(-1); }
          95% { left: -20px; transform: scaleX(-1); }
          100% { left: -20px; transform: scaleX(1); }
        }
        .tl-andando-betoneira { animation: tlAndarBetoneira 3.2s ease-in-out infinite; }
      `}</style>
      <img
        src={MASCOTE_BETONEIRA_URI}
        alt=""
        className="tl-andando-betoneira"
        style={{ position: "absolute", bottom: "10px", width: "70px", transformOrigin: "center" }}
      />
      <div style={{ position: "absolute", bottom: "6px", left: 0, right: 0, height: "2px", background: "var(--border-soft)" }} />
    </div>
  );
}

// Mascote da betoneira em tamanho pequeno, com uma leve animação de "pulo"
// — usada no tour de boas-vindas e no botão de ajuda flutuante.
function Betoneirinha({ tamanho = 64, animando = true }) {
  return (
    <div style={{ width: tamanho, height: tamanho, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes betBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .bet-corpo { animation: ${animando ? "betBounce 2.2s ease-in-out infinite" : "none"}; }
      `}</style>
      <img src={MASCOTE_BETONEIRA_URI} alt="" className="bet-corpo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

function Escavadeirinha({ tamanho = 64, animando = true }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" style={{ display: "block" }}>
      <style>{`
        @keyframes escBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes escBraco { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-8deg); } }
        @keyframes escPiscar { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
        .esc-corpo { animation: ${animando ? "escBounce 2.2s ease-in-out infinite" : "none"}; transform-origin: center bottom; }
        .esc-braco { animation: ${animando ? "escBraco 2.2s ease-in-out infinite" : "none"}; transform-origin: 58px 48px; }
        .esc-olho { animation: ${animando ? "escPiscar 4s ease-in-out infinite" : "none"}; transform-origin: center; }
      `}</style>
      <g className="esc-corpo">
        {/* esteiras */}
        <rect x="10" y="78" width="60" height="12" rx="6" fill="#2a2a2a" />
        <circle cx="18" cy="84" r="6" fill="#444" />
        <circle cx="62" cy="84" r="6" fill="#444" />
        {/* corpo */}
        <rect x="18" y="55" width="46" height="26" rx="6" fill="#E8A63D" />
        {/* cabine */}
        <rect x="24" y="34" width="26" height="24" rx="5" fill="#F5F2E9" stroke="#c9922e" strokeWidth="2" />
        {/* rostinho */}
        <g className="esc-olho">
          <circle cx="33" cy="45" r="2.4" fill="#1a1a1a" />
          <circle cx="43" cy="45" r="2.4" fill="#1a1a1a" />
        </g>
        <path d="M33 51 Q38 55 43 51" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* braço + caçamba */}
        <g className="esc-braco">
          <rect x="56" y="46" width="26" height="6" rx="3" fill="#c9922e" />
          <path d="M80 48 L92 42 L90 56 L78 58 Z" fill="#E8A63D" stroke="#c9922e" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}

function MascoteTour({ onFechar }) {
  const [passo, setPasso] = useState(0);
  const atual = TOUR_PASSOS[passo];
  const ultimo = passo === TOUR_PASSOS.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 1200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "22px",
          maxWidth: "420px",
          width: "100%",
          marginBottom: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <Betoneirinha tamanho={64} />
          <div style={{ flex: 1 }}>
            <h3 className="tl-display" style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>{atual.titulo}</h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>{atual.texto}</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {TOUR_PASSOS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === passo ? "16px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === passo ? "var(--amber)" : "var(--border)",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {!ultimo && (
              <Button variant="ghost" size="sm" onClick={onFechar}>Pular</Button>
            )}
            {passo > 0 && (
              <Button variant="subtle" size="sm" onClick={() => setPasso(passo - 1)}>Voltar</Button>
            )}
            <Button size="sm" onClick={() => (ultimo ? onFechar() : setPasso(passo + 1))}>
              {ultimo ? "Entendi!" : "Próximo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BotaoAjudaMascote({ onAbrir }) {
  return (
    <button
      onClick={onAbrir}
      className="tl-focus"
      title="Como usar o sistema"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 900,
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "var(--bg-panel)",
        border: "2px solid var(--amber)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <Betoneirinha tamanho={40} />
    </button>
  );
}
