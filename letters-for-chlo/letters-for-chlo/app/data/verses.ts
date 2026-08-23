// A small pool of comforting/encouraging Bible verses (KJV — public domain,
// so no API or cost needed). One is shown at random each time, so it
// changes as Chlo comes back to the site.

export type Verse = {
  text: string;
  reference: string;
};

export const verses: Verse[] = [
  {
    text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    reference: "Psalm 34:18",
  },
  {
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.",
    reference: "Isaiah 41:10",
  },
  {
    text: "He healeth the broken in heart, and bindeth up their wounds.",
    reference: "Psalm 147:3",
  },
  {
    text: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    reference: "Joshua 1:9",
  },
  {
    text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds.",
    reference: "Philippians 4:6-7",
  },
  {
    text: "Weeping may endure for a night, but joy cometh in the morning.",
    reference: "Psalm 30:5",
  },
  {
    text: "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.",
    reference: "Zephaniah 3:17",
  },
  {
    text: "Be strong and of a good courage, fear not: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
    reference: "Deuteronomy 31:6",
  },
  {
    text: "God is our refuge and strength, a very present help in trouble.",
    reference: "Psalm 46:1",
  },
  {
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    reference: "Matthew 11:28",
  },
  {
    text: "They that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary.",
    reference: "Isaiah 40:31",
  },
  {
    text: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD.",
    reference: "Psalm 121:1-2",
  },
  {
    text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    reference: "Lamentations 3:22-23",
  },
  {
    text: "Peace I leave with you, my peace I give unto you... Let not your heart be troubled, neither let it be afraid.",
    reference: "John 14:27",
  },
  {
    text: "Casting all your care upon him; for he careth for you.",
    reference: "1 Peter 5:7",
  },
  {
    text: "The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.",
    reference: "Nahum 1:7",
  },
];

export function getRandomVerse(excludeText?: string | null): Verse {
  const pool = excludeText
    ? verses.filter((v) => v.text !== excludeText)
    : verses;
  const source = pool.length > 0 ? pool : verses;
  return source[Math.floor(Math.random() * source.length)];
}
