import random

class TarotDeck:
    def __init__(self):
        # Rider-Waite (Standard)
        self.rw_major = [
            "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
            "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
            "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
            "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
        ]
        self.rw_suits = ["Wands", "Cups", "Swords", "Pentacles"]
        self.rw_ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Page", "Knight", "Queen", "King"]

        # Crowley Thoth (Variasjoner)
        self.thoth_major = [
            "The Fool", "The Magus", "The Priestess", "The Empress", "The Emperor",
            "The Hierophant", "The Lovers", "The Chariot", "Adjustment", "The Hermit",
            "Fortune", "Lust", "The Hanged Man", "Death", "Art",
            "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "The Aeon", "The Universe"
        ]
        self.thoth_suits = ["Wands", "Cups", "Swords", "Disks"]
        self.thoth_ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Princess", "Prince", "Queen", "Knight"]

        # Marseille (Fransk/Klassisk)
        self.marseille_major = [
            "Le Mat", "Le Bateleur", "La Papesse", "L'Impératrice", "L'Empereur",
            "Le Pape", "L'Amoureux", "Le Chariot", "La Justice", "L'Hermite",
            "La Roue de Fortune", "La Force", "Le Pendu", "L'Arcane sans nom (Death)", "Tempérance",
            "Le Diable", "La Maison Dieu", "L'Étoile", "La Lune", "Le Soleil", "Le Jugement", "Le Monde"
        ]
        self.marseille_suits = ["Bâtons", "Coupes", "Épées", "Deniers"]
        
    def _get_deck_structure(self, deck_type):
        if deck_type == 'Thoth':
            return self.thoth_major, self.thoth_suits, self.thoth_ranks
        elif deck_type == 'Marseille':
            return self.marseille_major, self.marseille_suits, self.rw_ranks
        return self.rw_major, self.rw_suits, self.rw_ranks

    def draw_spread(self, deck_type='Rider-Waite', count=1):
        major, suits, ranks = self._get_deck_structure(deck_type)
        
        # Generer hele stokken
        full_deck = []
        
        # Major
        for i, name in enumerate(major):
            full_deck.append({"name": name, "type": "Major Arcana", "suit": None, "number": i, "deckType": deck_type})
            
        # Minor
        for suit in suits:
            for i, rank in enumerate(ranks):
                full_deck.append({"name": f"{rank} of {suit}", "type": "Minor Arcana", "suit": suit, "number": i + 1, "deckType": deck_type})
        
        # Trekk unike kort
        drawn = random.sample(full_deck, count)
        return drawn

tarot_deck = TarotDeck()
