// A small pool of comforting/encouraging Bible verses, NIV (New International
// Version). One is shown at random each time, so it changes as Chlo comes
// back to the site.
//
// NIV is copyrighted (unlike the KJV text this file used to use), so it
// can't just be quoted for free with zero rules — but Biblica (who owns
// NIV) lets anyone quote up to 500 verses without asking permission first,
// as long as: 1) it's under 25% of a full Bible book, and 2) the copyright
// notice below appears somewhere in the work. This file is well under both
// limits, and the notice is included here and as a small credit line on the
// site itself (see the footer in app/page.tsx) — so this is all above
// board. Full policy: https://www.biblica.com/permission-to-quote/
//
// Scripture quotations taken from The Holy Bible, New International
// Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used
// by permission. All rights reserved worldwide. "NIV" and "New
// International Version" are trademarks registered in the United States
// Patent and Trademark Office by Biblica, Inc.™

export type Verse = {
  text: string;
  reference: string;
};

export const verses: Verse[] = [
  {
    text: `Since you are precious and honored in my sight, and because I love you, I will give people in exchange for you, nations in exchange for your life.`,
    reference: "Isaiah 43:4",
  },
  {
    text: `The LORD is close to the brokenhearted and saves those who are crushed in spirit.`,
    reference: "Psalm 34:18",
  },
  {
    text: `He heals the brokenhearted and binds up their wounds.`,
    reference: "Psalm 147:3",
  },
  {
    text: `The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.`,
    reference: "Zephaniah 3:17",
  },
  {
    text: `God is our refuge and strength, an ever-present help in trouble.`,
    reference: "Psalm 46:1",
  },
  {
    text: `Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.`,
    reference: "Joshua 1:9",
  },
  {
    text: `So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.`,
    reference: "Isaiah 41:10",
  },
  {
    text: `Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.`,
    reference: "Philippians 4:6-7",
  },
  {
    text: `I can do all this through him who gives me strength.`,
    reference: "Philippians 4:13",
  },
  {
    text: `Come to me, all you who are weary and burdened, and I will give you rest.`,
    reference: "Matthew 11:28",
  },
  {
    text: `Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.`,
    reference: "John 14:27",
  },
  {
    text: `Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you.`,
    reference: "Deuteronomy 31:6",
  },
  {
    text: `Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.`,
    reference: "Psalm 23:4",
  },
  {
    text: `The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?`,
    reference: "Psalm 27:1",
  },
  {
    text: `For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.`,
    reference: "Romans 8:38-39",
  },
  {
    text: `Cast your cares on the LORD and he will sustain you; he will never let the righteous be shaken.`,
    reference: "Psalm 55:22",
  },
  {
    text: `For I am the LORD your God who takes hold of your right hand and says to you, Do not fear; I will help you.`,
    reference: "Isaiah 41:13",
  },
  {
    text: `Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God.`,
    reference: "2 Corinthians 1:3-4",
  },
  {
    text: `Cast all your anxiety on him because he cares for you.`,
    reference: "1 Peter 5:7",
  },
  {
    text: `Because of the LORD's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.`,
    reference: "Lamentations 3:22-23",
  },
  {
    text: `For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.`,
    reference: "Jeremiah 29:11",
  },
  {
    text: `Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.`,
    reference: "Proverbs 3:5-6",
  },
  {
    text: `When anxiety was great within me, your consolation brought me joy.`,
    reference: "Psalm 94:19",
  },
];

export function getRandomVerse(excludeText?: string | null): Verse {
  const pool = excludeText
    ? verses.filter((v) => v.text !== excludeText)
    : verses;
  const source = pool.length > 0 ? pool : verses;
  return source[Math.floor(Math.random() * source.length)];
}
