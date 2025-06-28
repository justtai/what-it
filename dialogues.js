export const startScreenDialogues = [
    "You want it… or not? Let's make some impossible choices.",
    "Welcome, contestant! The game is simple: choose wisely, or suffer the consequences!",
    "Are you ready to risk it all? The cosmic game awaits!",
    "Step right up, folks! Your destiny is but an orb away!",
    "Greetings, earthling! Prepare for a truly peculiar game of chance!",
];

export const chooseOrbDialogues = [
    "Which one holds your destiny? Choose wisely.",
    "Behold, the orbs of fate! Select the one that calls to you.",
    "One orb, infinite possibilities. Which will be yours?",
    "Your journey begins now. Pick your champion!",
    "Don't just pick one, *feel* one. Which orb has your name on it?",
];

export const eliminateOrbDialogues = [
    "Which orb feels... unlucky? Open it. Get it out of here.",
    "Time to narrow down the field. Choose an orb to eliminate.",
    "More orbs, more danger! Which one must go?",
    "Don't get too attached to these. One of them is next to be revealed!",
    "The tension builds! Make your next elimination count.",
    "Another orb must fall. What's your gut telling you?",
];

export const curseRevealDialogues = [
    "Oof, that's a rough one. Cosmic bummer.",
    "Whoops! Looks like the universe had other plans for you.",
    "Well, that's... unfortunate. Better luck next time!",
    "A minor setback, wouldn't you say? Or is it?",
    "Ah, the bitter taste of defeat! Or just... wet pennies?",
    "Not quite what you wanted, but it certainly adds character!",
];

export const prizeRevealDialogues = [
    "A magnificent prize! But is it better than YOURS?",
    "What a cosmic treat! The universe smiles upon you!",
    "Behold, a true treasure! Or is it merely a distraction?",
    "That's a good one! You're certainly on a roll... or are you?",
    "Splendid! A valuable find! Keep it up, contestant!",
    "Could this be the one? Only time will tell!",
];

export const offerDialogues = [
    "A tempting offer... but is it better than what's in your orb?",
    "The moment of truth! Do you take the known, or chase the unknown?",
    "My very generous offer! Do you *want it* or *not*?",
    "Don't rush! This decision could change everything.",
    "A bird in the hand... or a cosmic dragon in the orb?",
    "Consider wisely, contestant. This is where legends are made!",
];

export const finalChoiceDialogues = [
    "The final decision... No pressure. The fate of your reality is... probably not at stake.",
    "It all comes down to this. Your orb, or the last remaining one?",
    "One last choice. Are you brave enough to stick with your gut?",
    "The ultimate showdown! Your past decision, or this last glimmer of hope?",
    "This is it! Choose the path less traveled, or stay on the one you're on?",
];

export const endScreenHostDialogues = [
    "You made your choice. Reality will now be slightly different. Thanks for playing!",
    "The cosmic scales are balanced! Or wildly tipped. Either way, it's done!",
    "Another game concluded! Your fate, sealed. Until next time!",
    "The lights dim, the show is over. What a ride!",
    "Did you win? Did you lose? Who cares! It was entertaining!",
    "Until the next cosmic cycle, farewell, brave contestant!",
];

export const getRandomDialogue = (dialogues) => dialogues[Math.floor(Math.random() * dialogues.length)];