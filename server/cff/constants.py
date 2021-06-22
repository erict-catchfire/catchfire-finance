from collections import defaultdict
from datetime import datetime

DEFAULT_SITE_MAP = [{"name": "Twitter", "url_domain": "twitter.com"}]
DEFAULT_SUPPORTED_TICKERS = ["AMZN", "DARE", "GOOG", "GME", "OSK", "MSFT"]


class CryptoList(object):
    _created_at = datetime.now()
    _instance = None
    map = defaultdict(lambda: False)

    def __new__(cls):
        _current_time = datetime.now()
        _time_elapsed = _current_time - cls._created_at
        refresh = _time_elapsed.seconds > 86400

        if cls._instance is None or refresh:
            cls._instance = super(CryptoList, cls).__new__(cls)

            # fmt: off
            cryptos = ["BTC", "ETH", "BNB", "XRP", "DOGE", "USDT", "ADA", "DOT", "BCH", "LTC", "UNI", "LINK", "VET", "XLM", "THETA", "FIL", "TRX", "USDC", "WBTC", "BSV", "EOS", "MIOTA", "SOL", "KLAY", "NEO", "XMR", "CRO", "LUNA", "AAVE", "XTZ", "ATOM", "BUSD", "BTT", "FTT", "AVAX", "ETC", "ALGO", "CHZ", "XEM", "DASH", "KSM", "EGLD", "HT", "CAKE", "DAI", "MKR", "RUNE", "BTCB", "DCR", "HOT", "ZEC", "COMP", "HBAR", "ZIL", "STX", "GRT", "ENJ", "SNX", "LEO", "BAT", "MATIC", "NEAR", "NEXO", "SUSHI", "BTG", "TFUEL", "MANA", "SC", "YFI", "ONT", "UST", "QTUM", "WAVES", "UMA", "RVN", "ZRX", "DGB", "CEL", "ICX", "RSR", "OMG", "BNT", "ONE", "ANKR", "ZEN", "FLOW", "IOST", "KCS", "HNT", "REN", "OKB", "FTM", "REV", "CHSB", "XVG", "CRV", "DENT", "NPXS", "BTMX", "VGX", "1INCH", "WRX", "CELO", "SNT", "CFX", "PAX", "LSK", "AR", "VTHO", "BTCST", "NANO", "XVS", "LRC", "MCO", "RENBTC", "OCEAN", "CKB", "KNC", "HUSD", "MDX", "LPT", "STORJ", "OGN", "EWT", "ZKS", "BCD", "REP", "GLM", "STMX", "DODO", "MAID", "QNT", "SKL", "IOTX", "WIN", "STEEM", "SAND", "REEF", "FET", "NKN", "ARDR", "KIN", "BAL", "BADGER", "CVC", "BTS", "FUN", "KMD", "BAND", "SXP", "AGI", "ANT", "TEL", "ALPHA", "ORBS", "VLX", "MED", "KAVA", "JST", "SWAP", "CELR", "WAXP", "XHV", "NMR", "WAN", "BTM", "PPT", "WOO", "SRM", "TUSD", "STRAX", "UBT", "CVT", "ARK", "OXT", "SCRT", "AVA", "ZB", "UTK", "ROSE", "ELF", "GT", "MTL", "GNO", "POLY", "RIF", "SYS", "HNS", "TOMO", "UQC", "TRAC", "META", "QKC", "NOIA", "AMPL", "COTI", "NU", "HIVE", "POLS", "POWR", "CTC", "HEX", "WBNB", "CCXX", "BRG", "HBTC", "FEI", "DFI", "INO", "XDC", "OMI", "XWC", "ORC", "BEST", "TTT", "PUNDIX", "THR", "BCHA", "vBNB", "RARI", "NXM", "HEDG", "STETH", "KSP", "AMP", "MIR", "MVL", "LINA", "ETN", "XIN", "ARRR", "LOTTO", "ZLW", "SOLO", "vXVS", "KEEP", "RFOX", "TRIBE", "ORN", "SFP", "AXS", "HTR", "AKT", "KLV", "RAY", "EAURIC", "AUDIO", "ANC", "BAKE", "TROY", "MATH", "SUPER", "FREE", "REV", "KAI", "vBTC", "GNY", "USDN", "PAID", "CRU", "HNC", "RLC", "PRQ", "IQ", "RNDR", "DAWN", "INJ", "BORA", "ATRI", "MONA", "RDD", "IRIS", "MARO", "SUN", "RGT", "ELA", "ALICE", "LIT", "ERN", "AION", "BNK", "MFT", "LYXe", "RAMP", "DNT", "EDG", "VAI", "RPL", "TKO", "DIA", "TWT", "LTO", "CTSI", "CHR", "PAI", "AKRO", "GAS", "DKA", "LOOM", "BCN", "XCM", "VRA", "CSC", "BZRX", "GALA", "SFI", "CRE", "SHR", "DDX", "DATA", "EPS", "MASK", "XOR", "HOGE", "PAC", "FARM", "EUM", "APL", "SPI", "PERP", "TSHP", "NRG", "MLK", "MLN", "BIFI", "ADX", "REQ", "BNANA", "BOTX", "STRK", "LON", "FLM", "ATT", "PHA", "WOZX", "UOS", "LA", "FIRO", "BSCPAD", "POND", "TT", "OXY", "MWC", "BLZ", "SUSD", "SAPP", "NRV", "LAMB", "NYE", "WTC", "ID", "KDA", "BEL", "DAO", "SPND", "PIB", "SURE", "MITH", "BLCT", "HXRO", "AE", "DUSK", "BEAM", "RLY", "NULS", "ALBT", "STAKE", "WHALE", "TRB", "RAD", "DX", "DEGO", "HARD", "NWC", "GUSD", "AMO", "PIVX", "TVK", "DIVI", "ABBC", "PHB", "OM", "GRN", "HC", "FRM", "API3", "BOND", "MHC", "ERG", "SOLVE", "COS", "ARPA", "CENNZ", "VSYS", "ZNN", "MBL", "MX", "EMC2", "GRS", "FRAX", "YFII", "RFR", "BAR", "IGNIS", "WNXM", "CTK", "BOA", "LBC", "VSP", "DSLA", "MXC", "SRK", "UNFI", "EXRD", "CTXC", "FRONT", "SERO", "WICC", "TITAN", "PAXG", "HUM", "DRS", "FX", "NXS", "AUCTION", "PCX", "BELT", "NEST", "MRPH", "MASS", "HEGIC", "OXEN", "XNC", "DRGN", "CREAM", "vETH", "MBN", "DCN", "SWTH", "VID", "VITE", "vUSDC", "PNK", "PERL", "AERGO", "KIMCHI", "NIM", "KEY", "HPT", "LOC", "BFC", "FIO", "IDEX", "DAG", "REVV", "SNL", "CND", "DAC", "SPARTA", "RING", "DG", "EDR", "QQQ", "SLT", "CVP", "MAPS", "SUKU", "KYL", "WING", "XPR", "SUTER", "FSN", "NXT", "NAS", "GRIN", "ESD", "FXF", "UPP", "STPT", "HELMET", "YOUC", "BAAS", "DREP", "PROM", "AXEL", "BURGER", "GXC", "MEME", "RCN", "NEBL", "OBSR", "DOCK", "BIP", "XYO", "VRSC", "ZCN", "SKY", "DDIM", "GTO", "SNTVT"]
            # fmt: on

            for crypto in cryptos:
                cls.map[crypto] = True

        return cls._instance
