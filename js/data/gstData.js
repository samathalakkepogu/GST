(function(window) {
  'use strict';

  const GST_DATABASE = [
  // =========================================================================
  // 1. COMPUTERS, IT & ELECTRONICS (HSN 84xx, 85xx)
  // =========================================================================
  {
    id: 'goods-laptop',
    hsnSac: '84713010',
    type: 'goods',
    category: 'IT & Electronics',
    description: 'Portable automatic data processing machines (Laptops, Notebooks, MacBooks)',
    keywords: ['laptop', 'notebook', 'macbook', 'portable computer', 'chromebook', 'ultrabook', 'thinkpad'],
    synonyms: ['laptop', 'notebook', 'portable pc', 'lap top', 'laptop computer'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule III, Entry 360',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule III, Entry 360',
        conditions: 'Standard applicable GST rate for portable computers and laptops.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-desktop-computer',
    hsnSac: '8471',
    type: 'goods',
    category: 'IT & Electronics',
    description: 'Automatic data processing machines, desktop computers, CPUs, and computer servers',
    keywords: ['desktop', 'computer', 'cpu', 'pc', 'server', 'workstation', 'all in one pc', 'computer system'],
    synonyms: ['desktop', 'personal computer', 'system', 'tower pc', 'desktop pc'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule III, Entry 360',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule III, Entry 360',
        conditions: 'Standard rate for desktop computers and servers.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-mobile-phone',
    hsnSac: '85171200',
    type: 'goods',
    category: 'IT & Electronics',
    description: 'Telephones for cellular networks (Mobile Phones, Smartphones, Handsets)',
    keywords: ['mobile', 'smartphone', 'phone', 'cell phone', 'iphone', 'android', 'handset', 'mobile phone'],
    synonyms: ['mobile', 'phone', 'cellphone', 'smart phone', 'handset', 'mobile device'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 14/2019-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: '2020-03-31',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        conditions: 'Historical rate applicable to mobile phones prior to 1st April 2020.'
      },
      {
        effectiveFrom: '2020-04-01',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 14/2019-Central Tax (Rate)',
        conditions: 'GST Council increased mobile phone rate from 12% to 18% effective 1st April 2020.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-printer',
    hsnSac: '84433200',
    type: 'goods',
    category: 'IT & Electronics',
    description: 'Computer Printers, Multi-function printing devices, Inkjet, Laser printers',
    keywords: ['printer', 'laser printer', 'inkjet', 'multi function printer', 'scanner', 'all in one printer'],
    synonyms: ['printer', 'print machine', 'xerox printer'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 41/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: '2017-11-14',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        conditions: 'Initial GST rate upon rollout.'
      },
      {
        effectiveFrom: '2017-11-15',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 41/2017-Central Tax (Rate)',
        conditions: 'Reduced from 28% to 18% in the 23rd GST Council meeting.'
      }
    ],
    confidence: 'high'
  },

  // =========================================================================
  // 2. FOOD, DRY FRUITS & GROCERIES (HSN 08xx, 15xx, 04xx, 10xx, 11xx)
  // =========================================================================
  {
    id: 'goods-foodgrains-pulses',
    name: 'Foodgrains (Rice, Wheat, Pulses, Flour, Dal)',
    hsnSac: '1006',
    relatedHsn: ['1006', '1001', '0713', '1101'],
    type: 'goods',
    category: 'Food & Groceries',
    description: 'Foodgrains, Rice, Wheat, Pulses (Dal), and Cereal Flour (Loose vs Pre-packaged & Labelled)',
    keywords: ['rice', 'wheat', 'dal', 'pulses', 'chawal', 'gehun', 'flour', 'atta', 'grain', 'unbranded grains', '1006', '1001', '0713', '1101'],
    synonyms: ['rice', 'wheat', 'chawal', 'dal', 'atta', 'grain', 'food grains', 'pulses'],
    hasMultipleRates: true,
    conditionType: 'packaging_choice',
    conditionPrompt: 'Select packaging and labelling condition:',
    conditionInputType: 'select',
    specificationNote: 'Applicable GST rate depends on packaging and labelling condition (Loose / unlabelled is 0% Exempt vs Pre-packaged & labelled <= 25kg is 5%).',
    conditionalRates: [
      {
        tierId: 'tier-grains-loose',
        label: 'Loose / Unlabelled / Unbranded or Bulk Package (> 25 kg)',
        specification: 'Loose / unlabelled or bulk pack > 25kg',
        hsnSac: '1006',
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 2/2017-Central Tax (Rate) & Notification 07/2022-CT(R)',
        conditionDescription: 'Exempt (0% GST) if supplied loose, unlabelled, or in bulk packages exceeding 25 kg.'
      },
      {
        tierId: 'tier-grains-prepackaged',
        label: 'Pre-packaged and Labelled in Unit Container (<= 25 kg / 25 litres)',
        specification: 'Pre-packaged and labelled unit container <= 25kg',
        hsnSac: '1006',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2022-07-18',
        effectiveTo: null,
        sourceNotification: 'Notification No. 06/2022-Central Tax (Rate), 47th GST Council Meeting',
        conditionDescription: 'Taxable at 5% GST if supplied pre-packaged and labelled in packages up to 25 kg.'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 2/2017-Central Tax (Rate)',
        conditions: '0% if loose/unlabelled; 5% if pre-packaged and labelled in packages <= 25 kg.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-unbranded-foodgrains',
    hsnSac: '1006',
    type: 'goods',
    category: 'Food & Groceries',
    description: 'Rice, wheat, and pulses (Loose / unlabelled)',
    keywords: ['rice', 'wheat', 'dal', 'pulses', 'chawal', 'gehun', 'unbranded grains'],
    synonyms: ['rice', 'wheat', 'chawal', 'dal', 'food grains'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 2/2017-Central Tax (Rate), Entry 45',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 2/2017-Central Tax (Rate), Entry 45',
        conditions: 'Unbranded and unlabelled food grains are exempt (0% GST).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-almonds-fresh',
    hsnSac: '08021100',
    type: 'goods',
    category: 'Food & Groceries',
    description: 'Almonds in shell / fresh dry fruits (Badam)',
    keywords: ['almonds', 'badam', 'nuts', 'dry fruits', 'almond in shell', 'mamra badam', 'gurbandi badam'],
    synonyms: ['almonds', 'badam', 'almond', 'baadam', 'badaam', 'dry fruit badam'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule II, Entry 30',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule II, Entry 30',
        conditions: 'Standard 12% rate for dry fruits (almonds, walnuts, pistachios).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-cashews',
    hsnSac: '08013100',
    type: 'goods',
    category: 'Food & Groceries',
    description: 'Cashew nuts in shell or shelled (Kaju)',
    keywords: ['cashew', 'kaju', 'cashew nuts', 'kaju pieces', 'roasted kaju'],
    synonyms: ['cashew', 'kaju', 'kaaju', 'cashews'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 27',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 27',
        conditions: 'Applicable 5% rate for cashew nuts.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-edible-oil',
    hsnSac: '1515',
    type: 'goods',
    category: 'Food & Groceries',
    description: 'Edible vegetable oils (Mustard oil, Sunflower oil, Groundnut oil, Soybean oil)',
    keywords: ['oil', 'cooking oil', 'edible oil', 'mustard oil', 'sunflower oil', 'groundnut oil', 'tel', 'refined oil'],
    synonyms: ['cooking oil', 'edible oil', 'oil', 'refined oil', 'tel'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 86',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 86',
        conditions: 'Standard 5% rate on all edible vegetable cooking oils.'
      }
    ],
    confidence: 'high'
  },

  // =========================================================================
  // 3. APPAREL, TEXTILES & FOOTWEAR (HSN 50xx, 52xx, 61xx, 62xx, 64xx)
  // =========================================================================
  {
    id: 'goods-apparel-shirts',
    name: 'Shirts (Apparel / Readymade)',
    hsnSac: '6205',
    relatedHsn: ['6205', '6105'],
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'Shirts (Men\'s, Boys\' or Unisex - Knitted HSN 6105 / Woven HSN 6205)',
    keywords: ['shirt', 'shirts', 'cotton shirt', 'formal shirt', 'casual shirt', 'linen shirt', 'men shirt', 'boys shirt', 'readymade shirt', 'knitted shirt', 'woven shirt', '6205', '6105'],
    synonyms: ['shirt', 'shirts', 'formal shirt', 'casual shirt', 'cotton shirt', 'readymade shirt', 'linen shirt', 'men shirt'],
    hasMultipleRates: true,
    conditionType: 'value_threshold',
    conditionPrompt: 'What is the sale value / price per piece?',
    conditionInputType: 'currency',
    specificationNote: 'Applicable GST rate depends on transaction value per piece (<= ₹1,000 is 5% vs > ₹1,000 is 12%).',
    conditionalRates: [
      {
        tierId: 'tier-shirt-under-1000',
        label: 'Sale value not exceeding ₹1,000 per piece',
        conditionCriteria: { max: 1000 },
        hsnSac: '6205',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 223',
        conditionDescription: 'Sale value per piece <= ₹1,000 (5% GST).'
      },
      {
        tierId: 'tier-shirt-above-1000',
        label: 'Sale value exceeding ₹1,000 per piece',
        conditionCriteria: { min: 1000.01 },
        hsnSac: '6205',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule II, Entry 158',
        conditionDescription: 'Sale value per piece > ₹1,000 (12% GST).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate)',
        conditions: '5% if sale value <= ₹1,000; 12% if sale value > ₹1,000 per piece.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-apparel-shirts-under-1000',
    hsnSac: '6205',
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'Shirts (Men\'s, Boys\' or Unisex - Knitted HSN 6105 / Woven HSN 6205) with Sale Value <= ₹1,000 per piece',
    keywords: ['shirt <= 1000', 'cheap shirt', 'budget shirt', 'cotton shirt under 1000', '6205', '6105'],
    synonyms: ['shirt <= 1000', 'budget shirt', 'shirt under 1000'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 223',
    specificationNote: 'Applicable GST rate depends on transaction value per piece (<= ₹1,000 vs > ₹1,000).',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 223',
        conditions: 'Articles of apparel and clothing accessories (Shirts) of sale value not exceeding ₹1,000 per piece.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-apparel-shirts-above-1000',
    hsnSac: '6205',
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'Shirts (Men\'s, Boys\' or Unisex - Knitted HSN 6105 / Woven HSN 6205) with Sale Value > ₹1,000 per piece',
    keywords: ['branded shirt', 'designer shirt', 'premium shirt', 'expensive shirt', 'shirt > 1000', 'formal shirt', 'partywear shirt', 'silk shirt', '6205', '6105'],
    synonyms: ['branded shirt', 'designer shirt', 'premium shirt', 'formal shirt', 'silk shirt', 'expensive shirt'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule II, Entry 158',
    specificationNote: 'Applicable GST rate depends on transaction value per piece (<= ₹1,000 vs > ₹1,000).',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule II, Entry 158',
        conditions: 'Articles of apparel and clothing accessories (Shirts) of sale value exceeding ₹1,000 per piece.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-apparel-women-blouses-shirts',
    hsnSac: '6206',
    relatedHsn: ['6206', '6106'],
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'Women\'s or Girls\' Blouses, Shirts and Shirt-Blouses (Knitted HSN 6106 / Woven HSN 6206)',
    keywords: ['blouse', 'women shirt', 'ladies shirt', 'ladies top', 'shirt blouse', 'crop top', 'tunic', '6206', '6106'],
    synonyms: ['blouse', 'women shirt', 'ladies shirt', 'ladies top', 'shirt blouse'],
    hasMultipleRates: true,
    conditionType: 'value_threshold',
    conditionPrompt: 'What is the sale value / price per piece?',
    conditionInputType: 'currency',
    specificationNote: 'Applicable GST rate depends on transaction value per piece (5% for <= ₹1,000; 12% for > ₹1,000).',
    conditionalRates: [
      {
        tierId: 'tier-blouse-under-1000',
        label: 'Sale value not exceeding ₹1,000 per piece',
        conditionCriteria: { max: 1000 },
        hsnSac: '6206',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 223',
        conditionDescription: 'Sale value per piece <= ₹1,000 (5% GST).'
      },
      {
        tierId: 'tier-blouse-above-1000',
        label: 'Sale value exceeding ₹1,000 per piece',
        conditionCriteria: { min: 1000.01 },
        hsnSac: '6206',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 158',
        conditionDescription: 'Sale value per piece > ₹1,000 (12% GST).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate)',
        conditions: '5% if sale value not exceeding ₹1,000 per piece; 12% if sale value exceeding ₹1,000 per piece.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-apparel-tshirts',
    hsnSac: '6109',
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'T-Shirts, Singlets and Other Vests (Knitted or Crocheted)',
    keywords: ['tshirt', 't-shirt', 'tee', 'singlet', 'vest', 'polo t-shirt', 'round neck', 'collar t-shirt', '6109'],
    synonyms: ['tshirt', 't-shirt', 'polo shirt', 'tee shirt', 'vest'],
    hasMultipleRates: true,
    conditionType: 'value_threshold',
    conditionPrompt: 'What is the sale value / price per piece?',
    conditionInputType: 'currency',
    specificationNote: 'Applicable GST rate depends on transaction value per piece (5% for <= ₹1,000; 12% for > ₹1,000).',
    conditionalRates: [
      {
        tierId: 'tier-tshirt-under-1000',
        label: 'Sale value not exceeding ₹1,000 per piece',
        conditionCriteria: { max: 1000 },
        hsnSac: '6109',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 223',
        conditionDescription: 'Sale value per piece <= ₹1,000 (5% GST).'
      },
      {
        tierId: 'tier-tshirt-above-1000',
        label: 'Sale value exceeding ₹1,000 per piece',
        conditionCriteria: { min: 1000.01 },
        hsnSac: '6109',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 158',
        conditionDescription: 'Sale value per piece > ₹1,000 (12% GST).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate)',
        conditions: '5% if sale value <= ₹1,000 per piece; 12% if sale value > ₹1,000 per piece.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-saree',
    hsnSac: '5007',
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'Saree, woven fabrics of silk, cotton, or synthetic textiles',
    keywords: ['saree', 'sari', 'silk saree', 'cotton saree', 'pattu saree', 'banarasi saree', 'kanchipuram saree'],
    synonyms: ['saree', 'sari', 'shari', 'traditional saree', 'pattu saree'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 200',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Schedule I, Entry 200',
        conditions: 'Standard 5% rate for sarees and woven fabric materials.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-footwear-standard',
    hsnSac: '6404',
    type: 'goods',
    category: 'Apparel & Textiles',
    description: 'Footwear, shoes, sandals, slippers, sneakers (Uniform 12% rate)',
    keywords: ['shoes', 'footwear', 'sandals', 'sneakers', 'slippers', 'boots', 'leather shoes', 'sports shoes'],
    synonyms: ['shoes', 'footwear', 'sandals', 'slippers', 'chappal'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 14/2021-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: '2021-12-31',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        conditions: 'Historical rate for footwear having retail sale price not exceeding ₹1,000.'
      },
      {
        effectiveFrom: '2022-01-01',
        effectiveTo: null,
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 14/2021-Central Tax (Rate)',
        conditions: 'Uniform 12% GST rate on footwear regardless of price value effective 1st Jan 2022.'
      }
    ],
    confidence: 'high'
  },

  // =========================================================================
  // 4. AUTOMOBILES, VEHICLES & AUTO PARTS (HSN 87xx)
  // =========================================================================
  {
    id: 'goods-automobile-passenger-cars',
    name: 'Motor Cars & Passenger Vehicles',
    hsnSac: '8703',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Motor cars and other passenger motor vehicles (Small Cars, Sedans, SUVs, Electric Vehicles)',
    keywords: ['car', 'cars', 'automobile', 'passenger vehicle', 'small car', 'suv', 'sedan', 'ev', 'electric car', 'motor car', '8703'],
    synonyms: ['car', 'motor car', 'passenger vehicle', 'automobile', 'four wheeler', 'vehicle'],
    hasMultipleRates: true,
    conditionType: 'specification_choice',
    conditionPrompt: 'Select vehicle specification, engine capacity, or fuel type:',
    conditionInputType: 'select',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate and Compensation Cess.',
    conditionalRates: [
      {
        tierId: 'tier-car-petrol-small',
        label: 'Small Petrol / LPG / CNG Car (Engine <= 1200cc, Length <= 4000mm)',
        specification: 'Petrol/LPG/CNG <= 1200cc, Length <= 4000mm',
        hsnSac: '8703',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '1%',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 385; Cess Notification 1/2017',
        conditionDescription: 'Petrol/LPG/CNG Engine <= 1200cc, Length <= 4000mm. Cess: 1% (Total effective tax: 29%).'
      },
      {
        tierId: 'tier-car-diesel-small',
        label: 'Small Diesel Car (Engine <= 1500cc, Length <= 4000mm)',
        specification: 'Diesel <= 1500cc, Length <= 4000mm',
        hsnSac: '8703',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '3%',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 385; Cess Notification 1/2017',
        conditionDescription: 'Diesel Engine <= 1500cc, Length <= 4000mm. Cess: 3% (Total effective tax: 31%).'
      },
      {
        tierId: 'tier-car-mid-sedan',
        label: 'Mid-Segment Cars & Sedans (Engine > 1500cc or Length > 4000mm, Non-SUV)',
        specification: 'Mid-size/Sedan > 1500cc or Length > 4000mm',
        hsnSac: '8703',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '15%',
        effectiveFrom: '2017-09-11',
        effectiveTo: null,
        sourceNotification: 'Notification No. 5/2017-Compensation Cess (Rate), 21st GST Council Meeting',
        conditionDescription: 'Mid-segment non-SUV passenger car. Cess: 15% (Total effective tax: 43%).'
      },
      {
        tierId: 'tier-car-suv',
        label: 'Sports Utility Vehicles (SUVs) (Engine > 1500cc, Length > 4000mm, Ground Clearance >= 170mm)',
        specification: 'SUV (Engine > 1500cc, Length > 4000mm, Clearance >= 170mm)',
        hsnSac: '8703',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '22%',
        effectiveFrom: '2023-07-26',
        effectiveTo: null,
        sourceNotification: 'Notification No. 02/2023-Compensation Cess (Rate), 50th GST Council Meeting',
        conditionDescription: 'SUV specifications. Cess: 22% (Total effective tax: 50%).'
      },
      {
        tierId: 'tier-car-electric',
        label: 'Electric Vehicles (EV Cars, Battery Operated Passenger Vehicles)',
        specification: 'Pure Electric / Battery Operated Vehicle',
        hsnSac: '8703',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-08-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 12/2019-Central Tax (Rate), 36th GST Council Meeting',
        conditionDescription: 'Electrically operated passenger vehicle. Cess: 0% (Total effective tax: 5%).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '1% to 22%',
        notification: 'Notification No. 1/2017-Central Tax (Rate) & Cess Notifications',
        conditions: 'GST rate is 28% (EV is 5%); Compensation Cess ranges from 1% to 22% based on vehicle specs.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-small-car-petrol',
    hsnSac: '8703',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Small Petrol, LPG & CNG Cars (Engine <= 1200cc, Length <= 4000mm)',
    keywords: ['small car', 'car', 'petrol car', 'cng car', 'lpg car', 'hatchback', 'swift', 'i10', 'baleno', 'wagonr', 'tiago', 'automobile', 'vehicle', '8703'],
    synonyms: ['small car', 'petrol car', 'cng car', 'hatchback car', 'motor car', 'small vehicle'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 385 & Notification No. 1/2017-Compensation Cess (Rate)',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '1%',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 385; Cess Notification 1/2017',
        conditions: 'Petrol, LPG or CNG motor cars of engine capacity <= 1200 cc and length <= 4000 mm. Compensation Cess: 1% (Total effective tax: 29%).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-small-car-diesel',
    hsnSac: '8703',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Small Diesel Cars (Engine <= 1500cc, Length <= 4000mm)',
    keywords: ['diesel car', 'small diesel car', 'diesel hatchback', 'swift diesel', 'i20 diesel', 'automobile', 'vehicle', '8703'],
    synonyms: ['diesel car', 'small diesel car', 'diesel vehicle', 'diesel motor car'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate) & Notification No. 1/2017-Compensation Cess (Rate)',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '3%',
        notification: 'Notification No. 1/2017-Central Tax (Rate); Cess Notification 1/2017',
        conditions: 'Diesel motor cars of engine capacity <= 1500 cc and length <= 4000 mm. Compensation Cess: 3% (Total effective tax: 31%).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-mid-segment-cars',
    hsnSac: '8703',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Mid-Segment & Other Passenger Cars (Engine > 1500cc or Length > 4000mm, Non-SUV)',
    keywords: ['sedan', 'mid segment car', 'honda city', 'verna', 'ciaz', 'passenger car', 'automobile', '8703'],
    synonyms: ['sedan car', 'mid segment car', 'passenger vehicle', 'luxury sedan', 'saloon car'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate) & Notification No. 5/2017-Compensation Cess (Rate)',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-09-11',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '15%',
        notification: 'Notification No. 5/2017-Compensation Cess (Rate), 21st GST Council Meeting',
        conditions: 'Mid-size passenger motor cars exceeding 1200cc (petrol) or 1500cc (diesel) or length exceeding 4000mm. Compensation Cess: 15% (Total effective tax: 43%).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-suv',
    hsnSac: '8703',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Sports Utility Vehicles (SUVs) & Large Luxury Vehicles',
    keywords: ['suv', 'sports utility vehicle', 'scorpio', 'fortuner', 'harrier', 'xuv700', 'creta', 'luxury car', 'automobile', '8703'],
    synonyms: ['suv', 'sports utility vehicle', 'large car', 'luxury suv', '4x4 vehicle'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 02/2023-Compensation Cess (Rate) & 50th GST Council Meeting',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2023-07-26',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '22%',
        notification: 'Notification No. 02/2023-Compensation Cess (Rate)',
        conditions: 'Motor vehicles known as SUVs with engine capacity > 1500cc, length > 4000mm and unladen ground clearance >= 170mm. Compensation Cess: 22% (Total effective tax: 50%).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-electric-vehicles',
    hsnSac: '8703',
    relatedHsn: ['8703', '8711'],
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Electric Vehicles (EV Cars, Electric Scooters, E-Bikes, Electric Buses)',
    keywords: ['ev', 'electric vehicle', 'electric car', 'electric scooter', 'e-bike', 'e-rickshaw', 'electric bus', 'nexon ev', 'ola electric', 'ather', 'automobile', '8703', '8711'],
    synonyms: ['electric vehicle', 'ev car', 'electric scooter', 'ev bike', 'e vehicle', 'battery vehicle', 'electric automobile'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 12/2019-Central Tax (Rate), 36th GST Council Meeting',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: '2019-07-31',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        conditions: 'Initial rate on electric vehicles prior to 36th GST Council meeting.'
      },
      {
        effectiveFrom: '2019-08-01',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 12/2019-Central Tax (Rate)',
        conditions: 'Electrically operated vehicles including pure electric cars, 2-wheelers, 3-wheelers and electric buses. Compensation Cess: 0% (Nil).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-two-wheelers',
    name: 'Motorcycles, Scooters & Two-Wheelers',
    hsnSac: '8711',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Motorcycles, mopeds, scooters, e-bikes and two-wheeled motor vehicles',
    keywords: ['bike', 'motorcycle', 'scooter', 'activa', 'splendor', 'pulsar', 'two wheeler', 'superbike', 'e-bike', '8711'],
    synonyms: ['motorcycle', 'bike', 'scooter', 'two wheeler', 'scooty', 'moped'],
    hasMultipleRates: true,
    conditionType: 'specification_choice',
    conditionPrompt: 'Select engine capacity or powertrain:',
    conditionInputType: 'select',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    conditionalRates: [
      {
        tierId: 'tier-bike-standard',
        label: 'Commuter Motorcycle / Scooter (Engine <= 350cc)',
        specification: 'Engine capacity <= 350cc',
        hsnSac: '8711',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 397',
        conditionDescription: 'Two-wheelers with engine capacity not exceeding 350cc. Compensation Cess: 0% (Total: 28%).'
      },
      {
        tierId: 'tier-bike-premium',
        label: 'Premium Motorcycle / Superbike (Engine > 350cc)',
        specification: 'Engine capacity > 350cc',
        hsnSac: '8711',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '3%',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate); Cess Notification 1/2017',
        conditionDescription: 'Motorcycles with engine capacity exceeding 350cc. Compensation Cess: 3% (Total: 31%).'
      },
      {
        tierId: 'tier-bike-electric',
        label: 'Electric Two-Wheeler / E-Scooter / E-Bike',
        specification: 'Battery / Electrically operated two-wheeler',
        hsnSac: '8711',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-08-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 12/2019-Central Tax (Rate)',
        conditionDescription: 'Electrically operated 2-wheelers. Compensation Cess: 0% (Total: 5%).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% to 3%',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 397',
        conditions: '28% GST on two-wheelers (3% Cess if engine > 350cc; 5% GST with 0% Cess for EV).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-two-wheeler-standard',
    hsnSac: '8711',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Motorcycles & Two-Wheelers (Engine capacity <= 350cc - Scooters, Commuter Bikes)',
    keywords: ['bike', 'motorcycle', 'scooter', 'activa', 'splendor', 'pulsar', 'two wheeler', 'moped', 'scooty', '8711'],
    synonyms: ['motorcycle', 'bike', 'scooter', 'two wheeler', 'scooty', 'moped'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 397',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 397',
        conditions: 'Two-wheelers with engine capacity not exceeding 350cc. Compensation Cess: 0% (Nil).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-two-wheeler-premium',
    hsnSac: '8711',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Premium Motorcycles & Superbikes (Engine capacity exceeding 350cc)',
    keywords: ['superbike', 'premium bike', 'bullet 500', 'harley', 'ducati', 'ktm 390', 'motorcycle > 350cc', '8711'],
    synonyms: ['superbike', 'sports bike', 'premium motorcycle', 'heavy bike'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate) & Notification No. 1/2017-Compensation Cess (Rate)',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '3%',
        notification: 'Notification No. 1/2017-Central Tax (Rate); Cess Notification 1/2017',
        conditions: 'Motorcycles with engine capacity exceeding 350cc. Compensation Cess: 3% (Total effective tax: 31%).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-three-wheelers',
    hsnSac: '8703',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Three-Wheelers & Auto Rickshaws (Passenger & Goods Carriers - Petrol/Diesel/CNG vs Electric)',
    keywords: ['auto', 'auto rickshaw', 'three wheeler', 'tuk tuk', 'tuktuk', '3 wheeler', 'tempo', 'e-rickshaw', '8703'],
    synonyms: ['auto rickshaw', 'three wheeler', '3 wheeler', 'auto', 'tuk tuk'],
    hasMultipleRates: true,
    conditionType: 'specification_choice',
    conditionPrompt: 'Select vehicle powertrain / type:',
    conditionInputType: 'select',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    conditionalRates: [
      {
        tierId: 'tier-auto-ice',
        label: 'Petrol / Diesel / CNG Auto Rickshaw (Three-Wheeler)',
        specification: 'ICE / Conventional Fuel Three-Wheeler',
        hsnSac: '8703',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 385',
        conditionDescription: 'Three-wheeled motor vehicles for transport of persons or goods. Compensation Cess: 0%.'
      },
      {
        tierId: 'tier-auto-electric',
        label: 'E-Rickshaw / Electric Three-Wheeler',
        specification: 'Battery / Electrically operated three-wheeler',
        hsnSac: '8703',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-08-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 12/2019-Central Tax (Rate)',
        conditionDescription: 'Electrically operated e-rickshaws and e-carts. Compensation Cess: 0%.'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate)',
        conditions: 'Three-wheeled motor vehicles: 28% for ICE; 5% for E-rickshaws. Compensation Cess: 0%.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-commercial-trucks',
    hsnSac: '8704',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Commercial Vehicles, Trucks, Lorries & Goods Transport Vehicles',
    keywords: ['truck', 'lorry', 'commercial vehicle', 'goods carrier', 'tipper', 'dumper', 'tata 407', 'eicher', '8704'],
    synonyms: ['truck', 'lorry', 'commercial vehicle', 'goods truck', 'heavy goods vehicle', 'carrier vehicle'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 390',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 390',
        conditions: 'Motor vehicles for the transport of goods (trucks, lorries, pickups, tippers). Compensation Cess: 0%.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-buses',
    hsnSac: '8702',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Buses, Coaches & Minibuses (Transport of 10 or more persons - ICE vs Electric)',
    keywords: ['bus', 'coach', 'minibus', 'passenger bus', 'school bus', 'public transport vehicle', 'electric bus', '8702'],
    synonyms: ['bus', 'passenger bus', 'coach', 'minibus', 'tourist bus'],
    hasMultipleRates: true,
    conditionType: 'specification_choice',
    conditionPrompt: 'Select bus powertrain / fuel type:',
    conditionInputType: 'select',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    conditionalRates: [
      {
        tierId: 'tier-bus-ice',
        label: 'Diesel / Petrol / CNG Bus (10 or more persons)',
        specification: 'ICE Bus / Minibus (10+ persons)',
        hsnSac: '8702',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '15%',
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 384 & Cess 1/2017',
        conditionDescription: 'ICE motor vehicles for transport of 10 or more persons. Cess: 15% (Total: 43%).'
      },
      {
        tierId: 'tier-bus-electric',
        label: 'Electric Bus / Battery Operated Public Transport Bus',
        specification: 'Pure Electric / Battery Operated Bus',
        hsnSac: '8702',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-08-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 12/2019-Central Tax (Rate)',
        conditionDescription: 'Electrically operated buses. Compensation Cess: 0% (Total: 5%).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '15%',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 384',
        conditions: 'ICE motor vehicles for transport of 10 or more persons (28% + 15% Cess). Electric buses are 5% with 0% Cess.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-parts',
    hsnSac: '8708',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Automobile Parts, Spares, Components & Accessories',
    keywords: ['spare parts', 'auto parts', 'car parts', 'brake', 'gearbox', 'axle', 'clutch', 'steering', 'suspension', 'automobile component', '8708'],
    synonyms: ['auto parts', 'car parts', 'spare parts', 'automobile spares', 'vehicle parts', 'auto component'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 394',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 394',
        conditions: 'Parts and accessories of motor vehicles under headings 8701 to 8705. (Certain hardware items may attract 18%).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-automobile-tractors',
    hsnSac: '8701',
    type: 'goods',
    category: 'Automobile & Parts',
    description: 'Agricultural Tractors and Road Tractors for Semi-Trailers',
    keywords: ['tractor', 'farm tractor', 'agricultural tractor', 'mahindra tractor', 'swaraj', 'farm vehicle', '8701'],
    synonyms: ['tractor', 'farm tractor', 'agricultural tractor', 'farming vehicle'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate), Entry 199',
    specificationNote: 'Exact classification/specifications are required to determine the applicable GST rate.',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate), Entry 199',
        conditions: 'Tractors (other than road tractors for semi-trailers of engine capacity > 1800cc). Compensation Cess: 0%.'
      }
    ],
    confidence: 'high'
  },

  // =========================================================================
  // 5. FURNITURE & HOME APPLIANCES (HSN 94xx, 84xx)
  // =========================================================================
  {
    id: 'goods-chair-furniture',
    hsnSac: '9401',
    type: 'goods',
    category: 'Furniture & Home',
    description: 'Chairs, office seats, swivel chairs, wooden chairs, plastic chairs',
    keywords: ['chair', 'office chair', 'wooden chair', 'plastic chair', 'ergonomic chair', 'revolving chair', 'furniture chair'],
    synonyms: ['chair', 'seats', 'office chair', 'armchair', 'kurshi'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 41/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: '2017-11-14',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        conditions: 'Initial rate for furniture items.'
      },
      {
        effectiveFrom: '2017-11-15',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 41/2017-Central Tax (Rate)',
        conditions: 'Reduced from 28% to 18% in the 23rd GST Council meeting.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-table-furniture',
    hsnSac: '9403',
    type: 'goods',
    category: 'Furniture & Home',
    description: 'Other furniture (Wooden tables, office desks, dining tables, beds, wardrobes)',
    keywords: ['table', 'desk', 'dining table', 'study table', 'bed', 'wardrobe', 'cupboard', 'furniture table'],
    synonyms: ['table', 'desk', 'office desk', 'furniture'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 41/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-11-15',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 41/2017-Central Tax (Rate)',
        conditions: 'Standard rate for domestic and office furniture.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-air-conditioner',
    hsnSac: '8415',
    type: 'goods',
    category: 'Furniture & Home',
    description: 'Air conditioning machines (Split AC, Window AC, Inverter AC)',
    keywords: ['ac', 'air conditioner', 'split ac', 'window ac', 'inverter ac', 'cooling machine'],
    synonyms: ['ac', 'air conditioner', 'air conditioning'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate)',
        conditions: 'Standard consumer durable 28% rate on Air Conditioners.'
      }
    ],
    confidence: 'high'
  },

  // =========================================================================
  // 6. SERVICES & HOSPITALITY (SAC 99xx)
  // =========================================================================
  {
    id: 'services-software-development',
    hsnSac: '998314',
    type: 'services',
    category: 'IT & Digital Services',
    description: 'Information technology (IT) design and development services (Custom software, web development, app development)',
    keywords: ['software', 'software development', 'web development', 'app development', 'it service', 'coding service', 'saas software', '9983'],
    synonyms: ['software', 'software development', 'it services', 'software service', 'custom software'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 11/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 11/2017-Central Tax (Rate)',
        conditions: 'Standard 18% rate on IT and software design services.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'goods-packaged-software',
    hsnSac: '85238020',
    type: 'goods',
    category: 'IT & Digital Services',
    description: 'Packaged / canned software supplied on physical media or license (Goods classification)',
    keywords: ['packaged software', 'software license', 'software cd', 'boxed software', 'operating system software', '8523'],
    synonyms: ['software goods', 'boxed software', 'packaged software'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 1/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 1/2017-Central Tax (Rate)',
        conditions: 'Standard 18% rate on packaged software goods.'
      }
    ],
    confidence: 'medium'
  },
  {
    id: 'services-restaurant',
    name: 'Restaurant, Dining & Catering Services',
    hsnSac: '996331',
    type: 'services',
    category: 'Hospitality & Food Services',
    description: 'Restaurant and food serving services (Standalone vs Hotel-based)',
    keywords: ['restaurant', 'food bill', 'cafe', 'dining', 'hotel food', 'restaurant service', 'swiggy delivery bill', 'zomato bill', 'catering', '996331'],
    synonyms: ['restaurant', 'cafe', 'dining', 'food service', 'restaurant bill'],
    hasMultipleRates: true,
    conditionType: 'service_type',
    conditionPrompt: 'Select restaurant type / premises:',
    conditionInputType: 'select',
    specificationNote: 'Applicable GST rate depends on restaurant premises (5% without ITC for standalone vs 18% with ITC in luxury hotel premises).',
    conditionalRates: [
      {
        tierId: 'tier-restaurant-standalone',
        label: 'Standalone Restaurant / Cafe / Delivery (AC or Non-AC, without ITC)',
        specification: 'Standalone restaurant / Cafe / Food delivery',
        hsnSac: '996331',
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2017-11-15',
        effectiveTo: null,
        sourceNotification: 'Notification No. 46/2017-Central Tax (Rate), 23rd GST Council Meeting',
        conditionDescription: '5% without Input Tax Credit (ITC) for all standalone restaurants, cafes, and delivery services.'
      },
      {
        tierId: 'tier-restaurant-luxury-hotel',
        label: 'Restaurant located in hotel premises with room tariff > ₹7,500/day (with ITC)',
        specification: 'Hotel premises with declared room tariff > ₹7,500',
        hsnSac: '996331',
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-10-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 20/2019-Central Tax (Rate)',
        conditionDescription: '18% with ITC for restaurants located within specified premises having room tariff > ₹7,500.'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-11-15',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 46/2017-Central Tax (Rate)',
        conditions: '5% without ITC for standalone restaurants; 18% with ITC in luxury hotels with room tariff > ₹7,500.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'services-restaurant-regular',
    hsnSac: '996331',
    type: 'services',
    category: 'Hospitality & Food Services',
    description: 'Restaurant and food serving services in standalone restaurants (AC / Non-AC) without ITC',
    keywords: ['standalone restaurant', 'cafe bill', 'dining', 'swiggy bill', 'zomato bill'],
    synonyms: ['standalone restaurant', 'cafe', 'restaurant bill'],
    hasMultipleRates: false,
    sourceNotification: 'Notification No. 46/2017-Central Tax (Rate)',
    rates: [
      {
        effectiveFrom: '2017-11-15',
        effectiveTo: null,
        gstRate: 5,
        cgst: 2.5,
        sgst: 2.5,
        igst: 5,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 46/2017-Central Tax (Rate)',
        conditions: '5% without Input Tax Credit (ITC) for standalone restaurants (AC or Non-AC).'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'services-hotel-accommodation',
    hsnSac: '996311',
    type: 'services',
    category: 'Hospitality & Food Services',
    description: 'Hotel room accommodation services, guest houses, lodges, resorts',
    keywords: ['hotel', 'hotel room', 'room booking', 'accommodation', 'lodge', 'resort stay', 'guest house', '996311'],
    synonyms: ['hotel', 'hotel stay', 'room accommodation', 'hotel booking'],
    hasMultipleRates: true,
    conditionType: 'value_threshold',
    conditionPrompt: 'What is the declared room tariff per unit/day?',
    conditionInputType: 'currency',
    specificationNote: 'Applicable GST rate depends on declared room tariff per day (<= ₹7,500 is 12% vs > ₹7,500 is 18%).',
    conditionalRates: [
      {
        tierId: 'tier-hotel-room-under-7500',
        label: 'Room Tariff not exceeding ₹7,500 per day',
        conditionCriteria: { max: 7500 },
        hsnSac: '996311',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-10-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 20/2019-Central Tax (Rate), 37th GST Council Meeting',
        conditionDescription: 'Tariff per room per day <= ₹7,500 is taxed at 12% GST.'
      },
      {
        tierId: 'tier-hotel-room-above-7500',
        label: 'Room Tariff exceeding ₹7,500 per day (Luxury / Premium)',
        conditionCriteria: { min: 7500.01 },
        hsnSac: '996311',
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-10-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 20/2019-Central Tax (Rate), 37th GST Council Meeting',
        conditionDescription: 'Tariff per room per day > ₹7,500 is taxed at 18% GST (with ITC).'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: '2019-09-30',
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        conditions: 'Tariff ₹2,500 to ₹7,500 per unit per day.'
      },
      {
        effectiveFrom: '2019-10-01',
        effectiveTo: null,
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 20/2019-Central Tax (Rate)',
        conditions: 'Room tariff up to ₹7,500 per day is taxed at 12%; above ₹7,500 at 18%.'
      }
    ],
    confidence: 'high'
  },
  {
    id: 'services-recreational-sac9996',
    hsnSac: '9996',
    type: 'services',
    category: 'Broad Services (Requires Specifics)',
    description: 'Recreational, cultural, and sporting services (Cinema, Amusement parks, Sports)',
    keywords: ['entertainment', 'amusement park', 'sports event', 'cinema', 'movie ticket', 'cultural service', 'sac 9996', '9996'],
    synonyms: ['entertainment service', 'recreational service', 'cinema ticket', 'movie ticket', 'sac 9996'],
    hasMultipleRates: true,
    conditionType: 'service_type',
    conditionPrompt: 'Select recreational activity / ticket price:',
    conditionInputType: 'select',
    specificationNote: 'Exact classification and ticket price are required to determine the applicable GST rate (12% for movie tickets <= ₹100; 18% for tickets > ₹100 and theme parks; 28% for casinos/gambling).',
    conditionalRates: [
      {
        tierId: 'tier-cinema-under-100',
        label: 'Cinema / Movie Tickets of value not exceeding ₹100',
        specification: 'Cinema ticket <= ₹100',
        hsnSac: '9996',
        gstRate: 12,
        cgst: 6,
        sgst: 6,
        igst: 12,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-01-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 27/2018-Central Tax (Rate)',
        conditionDescription: 'Movie ticket price <= ₹100 is taxed at 12%.'
      },
      {
        tierId: 'tier-cinema-above-100',
        label: 'Cinema / Movie Tickets of value exceeding ₹100',
        specification: 'Cinema ticket > ₹100',
        hsnSac: '9996',
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2019-01-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 27/2018-Central Tax (Rate)',
        conditionDescription: 'Movie ticket price > ₹100 is taxed at 18%.'
      },
      {
        tierId: 'tier-amusement-parks',
        label: 'Amusement Parks, Theme Parks & Water Parks',
        specification: 'Amusement park entry & rides',
        hsnSac: '9996',
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2018-01-25',
        effectiveTo: null,
        sourceNotification: 'Notification No. 1/2018-Central Tax (Rate)',
        conditionDescription: 'Admission to amusement parks and water parks.'
      },
      {
        tierId: 'tier-casinos-gaming',
        label: 'Casinos, Race Clubs & Specified Actionable Claims',
        specification: 'Casinos / Betting / Race club',
        hsnSac: '9996',
        gstRate: 28,
        cgst: 14,
        sgst: 14,
        igst: 28,
        compensationCess: '0% (Nil)',
        effectiveFrom: '2023-10-01',
        effectiveTo: null,
        sourceNotification: 'Notification No. 11/2023-Central Tax (Rate), 51st GST Council Meeting',
        conditionDescription: 'Casinos, horse racing, and specified gaming activities.'
      }
    ],
    rates: [
      {
        effectiveFrom: '2017-07-01',
        effectiveTo: null,
        gstRate: 18,
        cgst: 9,
        sgst: 9,
        igst: 18,
        compensationCess: '0% (Nil)',
        notification: 'Notification No. 11/2017-Central Tax (Rate)',
        conditions: 'Rate varies: 12% for movie tickets <= ₹100, 18% for tickets > ₹100 and theme parks, 28% for casinos.'
      }
    ],
    confidence: 'medium',
    requiresDisambiguation: true
  }
];

const GstDataService = {
  /**
   * Return entire GST database records
   * @returns {Array<object>}
   */
  getAllRecords() {
    return GST_DATABASE;
  },

  /**
   * Find record by ID
   * @param {string} id
   * @returns {object|undefined}
   */
  getRecordById(id) {
    return GST_DATABASE.find(item => item.id === id);
  },

  /**
   * Find record by HSN or SAC code
   * @param {string} hsnSac
   * @returns {object|undefined}
   */
  getRecordByHsn(hsnSac) {
    if (!hsnSac) return undefined;
    const clean = hsnSac.replace(/\s+/g, '').toLowerCase();
    return GST_DATABASE.find(item => {
      if (item.hsnSac.toLowerCase() === clean) return true;
      if (item.relatedHsn && item.relatedHsn.some(r => r.toLowerCase() === clean)) return true;
      return false;
    });
  },

  /**
   * Get applicable rate for a record on a given ISO date (YYYY-MM-DD)
   * @param {object} record
   * @param {string} invoiceIsoDate - 'YYYY-MM-DD'
   * @returns {object|null}
   */
  getApplicableRateForDate(record, invoiceIsoDate) {
    if (!record || !record.rates || record.rates.length === 0) return null;
    if (!invoiceIsoDate) {
      // Return the latest active rate if no date is given
      return record.rates[record.rates.length - 1];
    }

    const target = invoiceIsoDate.trim();

    // Find rate bracket where effectiveFrom <= invoiceIsoDate <= (effectiveTo || Infinity)
    const match = record.rates.find(rate => {
      const fromCheck = !rate.effectiveFrom || rate.effectiveFrom <= target;
      const toCheck = !rate.effectiveTo || rate.effectiveTo >= target;
      return fromCheck && toCheck;
    });

    // Fallback: If date is earlier than earliest effective date, return the earliest; else latest
    if (!match) {
      if (record.rates[0].effectiveFrom && target < record.rates[0].effectiveFrom) {
        return record.rates[0];
      }
      return record.rates[record.rates.length - 1];
    }

    return match;
  },

  /**
   * Reusable Conditional Rate Engine:
   * Evaluates product rate rules against user inputs (price value, specifications, packaging, tier ID, or date)
   * @param {object} record - Database record
   * @param {object} inputs - { value?: number, tierId?: string, specification?: string, packaging?: string }
   * @param {string} invoiceIsoDate - Optional ISO date
   * @returns {{
   *   resolved: boolean,
   *   isConditional: boolean,
   *   applicableRate?: number,
   *   cgst?: number,
   *   sgst?: number,
   *   igst?: number,
   *   compensationCess?: string,
   *   effectiveFrom?: string,
   *   effectiveTo?: string|null,
   *   sourceNotification?: string,
   *   conditionDescription?: string,
   *   matchedTier?: object|null,
   *   candidateTiers: Array<object>,
   *   conditionType?: string,
   *   conditionPrompt?: string,
   *   conditionInputType?: string,
   *   message: string
   * }}
   */
  evaluateConditionalRate(record, inputs = {}, invoiceIsoDate = null) {
    if (!record) return null;

    const baseRate = this.getApplicableRateForDate(record, invoiceIsoDate);

    // If record does not have multiple conditional rates, resolve directly
    if (!record.hasMultipleRates || !record.conditionalRates || record.conditionalRates.length === 0) {
      return {
        resolved: true,
        isConditional: false,
        applicableRate: baseRate ? baseRate.gstRate : 18,
        cgst: baseRate?.cgst !== undefined ? baseRate.cgst : ((baseRate?.gstRate || 18) / 2),
        sgst: baseRate?.sgst !== undefined ? baseRate.sgst : ((baseRate?.gstRate || 18) / 2),
        igst: baseRate?.igst !== undefined ? baseRate.igst : (baseRate?.gstRate || 18),
        compensationCess: baseRate?.compensationCess || '0% (Nil)',
        effectiveFrom: baseRate?.effectiveFrom || '2017-07-01',
        effectiveTo: baseRate?.effectiveTo || null,
        sourceNotification: record.sourceNotification || baseRate?.notification || 'Notification No. 1/2017-Central Tax (Rate)',
        conditionDescription: baseRate?.conditions || 'Standard applicable rate.',
        matchedTier: null,
        candidateTiers: []
      };
    }

    // Multiple conditional rates exist
    const { value, tierId, specification } = inputs;
    let cleanValue = NaN;
    if (value !== undefined && value !== null && value !== '') {
      cleanValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[₹,\s]/g, ''));
    }

    let matchedTier = null;

    if (record.conditionType === 'value_threshold') {
      if (!isNaN(cleanValue) && cleanValue > 0) {
        matchedTier = record.conditionalRates.find(tier => {
          const crit = tier.conditionCriteria || {};
          const minOk = crit.min === undefined || cleanValue >= crit.min;
          const maxOk = crit.max === undefined || cleanValue <= crit.max;
          return minOk && maxOk;
        });
      }
    } else if (tierId) {
      matchedTier = record.conditionalRates.find(t => t.tierId === tierId);
    } else if (specification) {
      const specClean = specification.toLowerCase().trim();
      matchedTier = record.conditionalRates.find(t => 
        (t.specification && t.specification.toLowerCase().includes(specClean)) ||
        (t.label && t.label.toLowerCase().includes(specClean))
      );
    }

    if (matchedTier) {
      return {
        resolved: true,
        isConditional: true,
        applicableRate: matchedTier.gstRate,
        cgst: matchedTier.cgst !== undefined ? matchedTier.cgst : (matchedTier.gstRate / 2),
        sgst: matchedTier.sgst !== undefined ? matchedTier.sgst : (matchedTier.gstRate / 2),
        igst: matchedTier.igst !== undefined ? matchedTier.igst : matchedTier.gstRate,
        compensationCess: matchedTier.compensationCess || '0% (Nil)',
        effectiveFrom: matchedTier.effectiveFrom || '2017-07-01',
        effectiveTo: matchedTier.effectiveTo || null,
        sourceNotification: matchedTier.sourceNotification || record.sourceNotification || 'Notification No. 1/2017-Central Tax (Rate)',
        conditionDescription: matchedTier.conditionDescription || matchedTier.label,
        matchedTier,
        candidateTiers: record.conditionalRates,
        message: `Rate resolved to ${matchedTier.gstRate}% based on selected condition (${matchedTier.label}).`
      };
    }

    // Unresolved condition: Return required prompt and candidate tiers
    return {
      resolved: false,
      isConditional: true,
      conditionType: record.conditionType,
      conditionPrompt: record.conditionPrompt || 'Additional product details are required to determine the applicable rate.',
      conditionInputType: record.conditionInputType || 'select',
      message: 'Multiple GST rates may apply. Additional product details are required to determine the applicable rate.',
      candidateTiers: record.conditionalRates,
      matchedTier: null
    };
  }
};

  // Expose on window for direct file:/// script loading
  if (typeof window !== 'undefined') {
    window.GST_DATABASE = GST_DATABASE;
    window.GstDataService = GstDataService;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GST_DATABASE, GstDataService };
  }
})(typeof window !== 'undefined' ? window : this);
