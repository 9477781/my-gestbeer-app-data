
import React, { useState, useEffect, useMemo } from 'react';
import type { BeerDetails } from './types';
import Header from './components/Header';

type Language = 'ja' | 'en';
type StoreInfo = { name: string; url: string; };

interface BeerWithStores {
  details: BeerDetails;
  hub_stores: StoreInfo[];
  '82_stores': StoreInfo[];
}

// Interfaces for the new raw data structure from JSON
interface RawStoreInfo {
  '店舗名': string;
  '店舗URL': string;
}

interface RawBeerData {
  '順番': number;
  '販売ゲストビール': string;
  '画像URL': string;
  'USPINTグラス価格': number;
  'ハッピー価格'?: number;
  'UK/2PINTグラス価格': number;
  'アルコール度数': number | string;
  'タイプ': string;
  'IBU': number;
  '生産地': string;
  '製造所': string;
  '特徴1': string;
  '特徴2': string;
  '特徴3': string;
  '販売店舗': RawStoreInfo[];
}

const translateStoreName = (jaName: string): string => {
    const storeMap: Record<string, string> = {
        // 82 Stores
        "８２神田店": "82 Kanda branch",
        "８２品川店": "82 Shinagawa branch",
        "８２赤坂店": "82 Akasaka branch",
        "８２関内店": "82 Kannai branch",
        "８２三田店": "82 Mita branch",
        "８２浜松町店": "82 Hamamatsucho branch",
        "８２新宿三丁目店": "82 Shinjuku Sanchome branch",
        "８２AKIBA TOLIM店": "82 AKIBA TOLIM branch",
        "８２築地店": "82 Tsukiji branch",
        "８２新宿西口大ガード店": "82 Shinjuku West Exit O-guard branch",
        "８２東銀座店": "82 Higashi-Ginza branch",
        "８２ロッテシティホテル錦糸町店": "82 Lotte City Hotel Kinshicho branch",
        "８２渋谷宮益坂店": "82 Shibuya Miyamasuzaka branch",
        "８２五反田西口店": "82 Gotanda West Exit branch",
        "８２横浜西口店": "82 Yokohama West Exit branch",
        // HUB Stores
        "HUB東京オペラシティ店": "HUB Tokyo Opera City branch",
        "HUB藤沢店": "HUB Fujisawa branch",
        "HUB川口店": "HUB Kawaguchi branch"
    };
    // Fallback for any new stores not in the map
    return storeMap[jaName] || jaName.replace(/店$/, ' branch').replace('８２', '82');
};


const StoreList: React.FC<{ type: 'HUB' | '82', stores: StoreInfo[], lang: Language }> = ({ type, stores, lang }) => (
    <div className="mt-8">
        <h4 className="text-2xl md:text-3xl font-bold border-l-4 border-gray-800 pl-3 mb-4 whitespace-nowrap">
            {type} {lang === 'ja' ? '取り扱い店舗のご案内' : 'Available Stores'}
        </h4>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-xl ml-4">
            {stores.map(store => (
                <li key={store.url}>
                    <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
                        {store.name}
                        <span className="ml-1 text-gray-400 font-semibold">&rsaquo;</span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const BeerInfoSection: React.FC<{ beerData: BeerWithStores, lang: Language }> = ({ beerData, lang }) => {
    const { details } = beerData;

    const formatBeerName = (name: string) => {
      if (lang === 'ja') {
        const nameParts = name.replace('　', ' ').split(/[×\s]/).filter(p => p);
        if (nameParts.length >= 3) {
            return `${nameParts[0]}<span class="mx-1">×</span>${nameParts[1]} ${nameParts.slice(2).join(' ')}`;
        }
      }
      // English or fallback
      return name.replace(/\sx\s/i, ' <span class="mx-1">x</span> ');
    };

    const formatPrice = (usPint: number, ukHalfPint: number, happyHourPrice?: number) => {
        const format = (val: number) => val.toLocaleString();
        if (lang === 'ja') {
            const usPintStr = `US1PINTグラス＝${format(usPint)}円`;
            const ukHalfPintStr = `UK1/2PINTグラス＝${format(ukHalfPint)}円`;

            if (happyHourPrice) {
                const happyHourStr = `<span class="block md:inline text-red-600 md:ml-2">（ハッピーアワー＝${format(happyHourPrice)}円）</span>`;
                return `<span>${usPintStr}</span>${happyHourStr}<br/>${ukHalfPintStr}`;
            }
            
            return `${usPintStr}<br/>${ukHalfPintStr}`;
        }
        // English or fallback
        let happyHourInfo = '';
        if (happyHourPrice) {
            happyHourInfo = ` <span class="text-red-600">(Happy Hour: ¥${format(happyHourPrice)})</span>`
        }
        const usPintStr = `US 1 PINT ¥${format(usPint)}${happyHourInfo}`;
        const ukHalfPintStr = `UK 1/2 PINT ¥${format(ukHalfPint)}`;
        return `${usPintStr}<br/>${ukHalfPintStr}`;
    };
    
    const name = formatBeerName(lang === 'ja' ? details.name_ja : details.name_en);
    const price = formatPrice(details.price_us_pint, details.price_uk_half_pint, details.price_us_pint_happy_hour);

    return (
        <section className="mb-16">
            { details.id === 1 && (
                <p className="text-center text-xl text-gray-600 mb-2">
                    {lang === 'ja' ? '『82ALEHOUSE』でしか飲めない限定の1杯をあなたに' : 'A special glass you can only drink at "82 ALE HOUSE"'}
                </p>
            )}
            <h3 className="text-center text-5xl md:text-6xl font-bold mb-3 text-blue-700" dangerouslySetInnerHTML={{ __html: name }}></h3>
            <p className="text-center text-2xl text-gray-800 mb-8 font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: price }}></p>
            
            <div className="bg-gray-50 border border-gray-200 p-6 md:flex md:space-x-8">
                <div className="flex-shrink-0 text-center mb-6 md:mb-0 md:w-[300px]">
                    <img src={details.image_url} alt={lang === 'ja' ? details.name_ja : details.name_en} className="inline-block border p-1 bg-white w-full max-w-xs object-contain" />
                </div>
                <div className="flex-grow text-xl leading-relaxed">
                    <div className="text-gray-600 space-y-2">
                        {details.abv && (
                            <p><span className="font-semibold text-gray-800">{lang === 'ja' ? 'アルコール度数' : 'ABV'}</span>＝{details.abv}</p>
                        )}
                        {details.type && (
                            <p><span className="font-semibold text-gray-800">{lang === 'ja' ? 'タイプ' : 'Type'}</span>＝{details.type}</p>
                        )}
                        {details.ibu && (
                           <p><span className="font-semibold text-gray-800">IBU</span>＝{details.ibu}</p>
                        )}
                        {(lang === 'ja' ? details.production_area_ja : details.production_area_en) && (
                            <p><span className="font-semibold text-gray-800">{lang === 'ja' ? '生産地' : 'Origin'}</span>＝{lang === 'ja' ? details.production_area_ja : details.production_area_en}</p>
                        )}
                        {(lang === 'ja' ? details.brewery_ja : details.brewery_en) && (
                             <p><span className="font-semibold text-gray-800">{lang === 'ja' ? '製造所' : 'Brewery'}</span>＝{lang === 'ja' ? details.brewery_ja : details.brewery_en}</p>
                        )}
                    </div>

                    <p className="font-bold mt-5 text-gray-800">【{lang === 'ja' ? '特徴' : 'Features'}】</p>
                    <div className="text-gray-600 space-y-2">
                        {(lang === 'ja' ? details.features_ja : details.features_en).map((feature, index) => (
                           <p key={index}>{feature.replace(/香り＝|特徴＝|味わい＝|Aroma: |Characteristics: |Taste: /g, '')}</p>
                        ))}
                    </div>
                    
                    <p className="text-red-600 font-bold mt-6" style={{ whiteSpace: 'pre-line' }}>
                        {lang === 'ja' ? '数量限定の為、販売しているゲストビールが異なる場合も御座います。\n詳しい樽の開栓情報は店舗までお問い合わせください。' : 'Because quantities are limited, the guest beer on sale may differ.\nPlease contact the store directly for detailed information on which kegs are open.'}
                    </p>
                </div>
            </div>

            { beerData['82_stores'].length > 0 && <StoreList type="82" stores={beerData['82_stores']} lang={lang} /> }
            { beerData.hub_stores.length > 0 && <StoreList type="HUB" stores={beerData.hub_stores} lang={lang} /> }
        </section>
    );
};


const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ja');
  const [rawBeers, setRawBeers] = useState<RawBeerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'ja') {
      setLang(urlLang);
    }
    
    try {
      const dataEl = document.getElementById('guest-beer-data');
      if (dataEl) {
        const beerData: RawBeerData[] = JSON.parse(dataEl.textContent || '[]');
        setRawBeers(beerData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to parse guest beer data", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const formattedDate = useMemo(() => {
    if (!lastUpdated) return '';
    if (lang === 'ja') {
        return `${lastUpdated.getFullYear()}年${lastUpdated.getMonth() + 1}月${lastUpdated.getDate()}日 更新`;
    }
    return `Last Updated: ${lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  }, [lastUpdated, lang]);

  const beersWithStores = useMemo(() => {
    return rawBeers.map(rawBeer => {
      const getImage = (name: string, url: string) => {
        if (url) return url;
        if (name.includes('ギネス')) return "https://images.unsplash.com/photo-1598614294435-461327f6510a?q=80&w=1964&auto=format&fit=crop";
        if (name.includes('パンク')) return "https://images.unsplash.com/photo-1618885450695-66972b738c10?q=80&w=1974&auto=format&fit=crop";
        return "https://www.pub-hub.com/assets/common/images/common/no_image.png"; 
      };
      
      const generateEnName = (jaName: string): string => {
        const nameMap: Record<string, string> = {
            "８２×COEDO　ギャラクシーIPA": "82 x COEDO Galaxy IPA",
            "８２×スワンレイク　 SESSION IPA": "82 x Swan Lake SESSION IPA",
            "ギネス": "Guinness",
            "パンクＩＰＡ": "Punk IPA"
        };
        return nameMap[jaName] || jaName;
      };

      const details: BeerDetails = {
        id: rawBeer['順番'],
        name_ja: rawBeer['販売ゲストビール'],
        name_en: generateEnName(rawBeer['販売ゲストビール']),
        type: rawBeer['タイプ'],
        abv: rawBeer['アルコール度数'] ? `${rawBeer['アルコール度数']}%` : '',
        ibu: rawBeer['IBU'],
        price_us_pint: rawBeer['USPINTグラス価格'],
        price_us_pint_happy_hour: rawBeer['ハッピー価格'],
        price_uk_half_pint: rawBeer['UK1/2PINTグラス価格'],
        production_area_ja: rawBeer['生産地'],
        production_area_en: '',
        brewery_ja: rawBeer['製造所'],
        brewery_en: '',
        features_ja: [rawBeer['特徴1'], rawBeer['特徴2'], rawBeer['特徴3']].filter(f => f),
        features_en: [],
        image_url: getImage(rawBeer['販売ゲストビール'], rawBeer['画像URL']),
      };

      const hub_stores_raw: RawStoreInfo[] = [];
      const eighty_two_stores_raw: RawStoreInfo[] = [];

      (rawBeer['販売店舗'] || []).forEach(store => {
        if (store['店舗名'].includes('82') || store['店舗名'].includes('８２')) {
          eighty_two_stores_raw.push(store);
        } else {
          hub_stores_raw.push(store);
        }
      });
      
      hub_stores_raw.sort((a, b) => a['店舗名'].localeCompare(b['店舗名'], 'ja'));
      eighty_two_stores_raw.sort((a, b) => a['店舗名'].localeCompare(b['店舗名'], 'ja'));

      const toDisplayStore = (rawStore: RawStoreInfo): StoreInfo => ({
          name: lang === 'ja' ? rawStore['店舗名'] : translateStoreName(rawStore['店舗名']),
          url: rawStore['店舗URL'],
      });

      const hub_stores = hub_stores_raw.map(toDisplayStore);
      const eighty_two_stores = eighty_two_stores_raw.map(toDisplayStore);

      return {
        details,
        hub_stores,
        '82_stores': eighty_two_stores,
      };
    }).sort((a, b) => a.details.id - b.details.id);
  }, [rawBeers, lang]);


  return (
    <div className="bg-white text-gray-800">
      <Header lang={lang} setLang={setLang} />
      <main id="contents" className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            {lastUpdated && (
                <p className="text-right text-lg text-gray-500 mb-8">{formattedDate}</p>
            )}
            {loading ? (
              <p className="text-center">Loading guest beers...</p>
            ) : rawBeers.length > 0 ? (
              <>
                {beersWithStores.map((beerData, index) => (
                    <React.Fragment key={beerData.details.id}>
                        {index > 0 && <hr className="my-16 border-gray-300" />}
                        <BeerInfoSection beerData={beerData} lang={lang} />
                    </React.Fragment>
                ))}
                <div className="text-lg text-gray-600 mt-8 space-y-2">
                    <p>{lang === 'ja' ? '※在庫状況により、販売しているゲストビールは異なります。' : '*Guest beers on sale may vary depending on stock.'}</p>
                    <p>{lang === 'ja' ? '※より詳細な情報を知りたい方は直接店舗までお問合せ下さい。' : '*For more detailed information, please contact the store directly.'}</p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No guest beer information available at the moment.</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
