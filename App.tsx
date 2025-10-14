import React, { useState, useEffect, useMemo } from 'react';
import type { GuestBeerMasterData, BeerDetails } from './types';
import Header from './components/Header';

type Language = 'ja' | 'en';
type StoreInfo = { name: string; url: string; };

interface BeerWithStores {
  details: BeerDetails;
  hub_stores: StoreInfo[];
  '82_stores': StoreInfo[];
}

const StoreList: React.FC<{ type: 'HUB' | '82', stores: StoreInfo[], lang: Language }> = ({ type, stores, lang }) => (
    <div className="mt-8">
        <h4 className="font-bold border-l-4 border-gray-800 pl-2 mb-4">
            {type} {lang === 'ja' ? '取り扱い店舗のご案内' : 'Available Stores'}
        </h4>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm ml-4">
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
            let happyHourInfo = '';
            if (happyHourPrice) {
                happyHourInfo = ` <span class="text-red-600">（ハッピーアワー＝${format(happyHourPrice)}円）</span>`;
            }
            const usPintStr = `US1PINTグラス＝${format(usPint)}円${happyHourInfo}`;
            const ukHalfPintStr = `UK1/2PINTグラス＝${format(ukHalfPint)}円`;

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
        <section className="mb-12">
            { details.id === 1 && (
                <p className="text-center text-sm text-gray-600 mb-2">
                    {lang === 'ja' ? '『82ALEHOUSE』でしか飲めない限定の1杯をあなたに' : 'A special glass you can only drink at "82 ALE HOUSE"'}
                </p>
            )}
            <h3 className="text-center text-2xl md:text-3xl font-bold mb-2 text-blue-700" dangerouslySetInnerHTML={{ __html: name }}></h3>
            <p className="text-center text-gray-800 mb-6 font-semibold" dangerouslySetInnerHTML={{ __html: price }}></p>
            
            <div className="bg-gray-50 border border-gray-200 p-4 md:flex md:space-x-6">
                <div className="flex-shrink-0 text-center mb-4 md:mb-0 md:w-[250px]">
                    <img src={details.image_url} alt={lang === 'ja' ? details.name_ja : details.name_en} className="inline-block border p-1 bg-white max-w-[220px] md:max-w-full" />
                </div>
                <div className="flex-grow text-sm leading-relaxed">
                    <div className="text-gray-600 space-y-1">
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

                    <p className="font-bold mt-4 text-gray-800">【{lang === 'ja' ? '特徴' : 'Features'}】</p>
                    <div className="text-gray-600 space-y-2">
                        {(lang === 'ja' ? details.features_ja : details.features_en).map((feature, index) => (
                           <p key={index}>{feature.replace(/香り＝|特徴＝|味わい＝|Aroma: |Characteristics: |Taste: /g, '')}</p>
                        ))}
                    </div>
                    
                    <p className="text-red-600 font-bold mt-4" style={{ whiteSpace: 'pre-line' }}>
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
  const [beerData, setBeerData] = useState<GuestBeerMasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'ja') {
      setLang(urlLang);
    }
    
    const fetchData = async () => {
      try {
        // 環境変数からGAS APIのURLを取得
        const gasApiUrl = import.meta.env.VITE_GAS_API_URL;
        
        if (gasApiUrl) {
          // GAS APIからデータを取得
          const response = await fetch(gasApiUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch data from GAS API');
          }
          const data: GuestBeerMasterData = await response.json();
          setBeerData(data);
        } else {
          // フォールバック: HTML内の埋め込みデータを使用
          const dataEl = document.getElementById('guest-beer-data');
          if (dataEl) {
            const data: GuestBeerMasterData = JSON.parse(dataEl.textContent || '{}');
            setBeerData(data);
          }
        }
      } catch (err) {
        console.error("Failed to load guest beer data", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const beersWithStores = useMemo(() => {
    if (!beerData) {
      return [];
    }

    const { stores, beers } = beerData;
    
    const allBeersWithStores: BeerWithStores[] = beers.map(beer => {
        const { available_at, ...details } = beer;
        
        const hub_stores: StoreInfo[] = [];
        const eightyTwo_stores: StoreInfo[] = [];

        available_at.forEach(storeName => {
            if (stores[storeName]) {
                const storeInfo = { name: storeName, url: stores[storeName] };
                if (storeName.includes('82')) {
                    eightyTwo_stores.push(storeInfo);
                } else {
                    hub_stores.push(storeInfo);
                }
            }
        });

        hub_stores.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        eightyTwo_stores.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        
        return {
            details,
            hub_stores,
            '82_stores': eightyTwo_stores,
        };
    });

    return allBeersWithStores.filter(b => b.hub_stores.length > 0 || b['82_stores'].length > 0);
  }, [beerData]);


  return (
    <div className="bg-white text-gray-800">
      <Header lang={lang} setLang={setLang} />
      <main id="contents" className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <p className="text-center">Loading guest beers...</p>
            ) : error ? (
              <p className="text-center text-red-600">Error: {error}</p>
            ) : beersWithStores.length > 0 ? (
              <>
                {beersWithStores.map((beerData, index) => (
                    <React.Fragment key={beerData.details.id}>
                        {index > 0 && <hr className="my-12 border-gray-300" />}
                        <BeerInfoSection beerData={beerData} lang={lang} />
                    </React.Fragment>
                ))}
                <div className="text-xs text-gray-600 mt-8 space-y-1">
                    <p>{lang === 'ja' ? '※在庫状況により、販売しているゲストビールは異なります。' : '*Guest beers on sale may vary depending on stock.'}</p>
                    <p>{lang === 'ja' ? '※より詳細な情報を知りたい方は直接店舗までお問合せ下さい。' : '*For more detailed information, please contact the store directly.'}</p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">{lang === 'ja' ? '現在利用可能なゲストビール情報はありません。' : 'No guest beer information available at the moment.'}</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
