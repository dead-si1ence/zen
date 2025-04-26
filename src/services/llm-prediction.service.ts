import Groq from 'groq-sdk';
import { UFCPrediction, Formula1Prediction, FootballPrediction, EsportsPrediction, Fighter, Driver, Team } from '../types/models';

/**
 * Service for LLM-generated predictions using Groq API
 */
export class LLMPredictionService {
  private groq: Groq;
  private model = 'llama-3.3-70b-versatile';
  
  constructor() {
    this.groq = new Groq({
        apiKey: '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',
        dangerouslyAllowBrowser: true
    });
  }
  
  /**
   * Get a UFC fight prediction
   */
  async getUFCPrediction(fighter1: Fighter | string, fighter2: Fighter | string, event: string): Promise<Partial<UFCPrediction>> {
    const fighter1Name = typeof fighter1 === 'string' ? fighter1 : fighter1.name;
    const fighter2Name = typeof fighter2 === 'string' ? fighter2 : fighter2.name;
    
    try {
      console.log(`Getting LLM prediction for UFC fight: ${fighter1Name} vs ${fighter2Name}`);
      
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I will give you the names of two UFC fighters, and you will predict the winner of the match, and tell me the winner name, the method of victory (KO, TKO, Submission, Decision), the round the fight ends, the confidence of the prediction, and the date of the match in the following JSON format: {"winner": "fighter name", "method": "method of victory", "round": round number, "confidence": confidence percentage, "date": "date"}. The fighters are: ${fighter1Name} vs ${fighter2Name} at ${event}.`
          }
        ],
        model: this.model
      });
      
      console.log("LLM response received for UFC prediction");
      const content = completion.choices[0]?.message?.content || '{}';
      
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{.*\}/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        const result = JSON.parse(jsonStr);
        
        console.log("Parsed LLM UFC result:", result);
        
        // Create fighter objects
        const fighter1Obj: Fighter = typeof fighter1 === 'string' 
          ? { name: fighter1Name } 
          : fighter1;
          
        const fighter2Obj: Fighter = typeof fighter2 === 'string'
          ? { name: fighter2Name }
          : fighter2;
        
        return {
          id: `${Date.now()}`,
          fighter1: fighter1Obj,
          fighter2: fighter2Obj,
          event: event,
          date: result.date || new Date().toISOString().split('T')[0],
          confidence: parseInt(result.confidence) || 70,
          method: result.method || 'Decision',
          round: result.round || 3,
          winner: result.winner
        };
      } catch (e) {
        console.error('Error parsing LLM response for UFC prediction:', e);
        throw new Error('Failed to parse UFC prediction data');
      }
    } catch (e) {
      console.error('Error getting UFC prediction from LLM:', e);
      throw new Error('Failed to get UFC prediction from AI service');
    }
  }
  
  /**
   * Get a Formula 1 race prediction
   */
  async getFormula1Prediction(race: string, date: string): Promise<Partial<Formula1Prediction>> {
    try {
      console.log(`Getting LLM prediction for Formula 1 race: ${race} on ${date}`);
      
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I will give you a Formula 1 race name and date, and you will predict the race outcome. Tell me the top 3 positions (with driver names), the pole position driver, the driver with the fastest lap, and your confidence in the prediction in the following JSON format: {"p1": "driver name", "p2": "driver name", "p3": "driver name", "pole": "driver name", "fastestLap": "driver name", "confidence": confidence percentage}. The race is: ${race} on ${date}.`
          }
        ],
        model: this.model
      });
      
      console.log("LLM response received for Formula 1 prediction");
      const content = completion.choices[0]?.message?.content || '{}';
      
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{.*\}/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        const result = JSON.parse(jsonStr);
        
        console.log("Parsed LLM F1 result:", result);
        
        // Create Driver objects
        const poleDriver: Driver = { 
          name: result.pole, 
          number: 1 // Default number
        };
        
        const fastestLapDriver: Driver = { 
          name: result.fastestLap, 
          number: 1 // Default number
        };
        
        // Create podium with correct structure
        const podium = [
          { 
            position: 1, 
            driver: { name: result.p1, number: 1 } as Driver 
          },
          { 
            position: 2, 
            driver: { name: result.p2, number: 2 } as Driver 
          },
          { 
            position: 3, 
            driver: { name: result.p3, number: 3 } as Driver 
          }
        ];
        
        return {
          id: `${Date.now()}`,
          name: race,
          date: date,
          podium: podium,
          polePosition: poleDriver,
          fastestLap: fastestLapDriver,
          confidence: parseInt(result.confidence) || 70
        };
      } catch (e) {
        console.error('Error parsing LLM response for F1 prediction:', e);
        throw new Error('Failed to parse Formula 1 prediction data');
      }
    } catch (e) {
      console.error('Error getting Formula 1 prediction from LLM:', e);
      throw new Error('Failed to get Formula 1 prediction from AI service');
    }
  }
  
  /**
   * Get a Football match prediction
   */
  async getFootballPrediction(team1: string, team2: string): Promise<Partial<FootballPrediction>> {
    try {
      console.log(`Getting LLM prediction for ${team1} vs ${team2}`);
      
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I will give you the name of two football teams, and you will predict the winner of the match, and tell me the winner team name, the score, the confidence of the prediction, and the date of the match in the following JSON format: {"winner": "team name", "score": "score", "confidence": confidence percentage, "date": "date"}. The teams are: ${team1} vs ${team2}.`
          }
        ],
        model: this.model
      });
      
      console.log("LLM response received");
      const content = completion.choices[0]?.message?.content || '{}';
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{.*\}/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        const result = JSON.parse(jsonStr);
        
        console.log("Parsed LLM result:", result);
        
        // Create team objects
        const homeTeamObj: Team = { name: team1 };
        const awayTeamObj: Team = { name: team2 };
        
        return {
          id: `${Date.now()}`,
          homeTeam: homeTeamObj,
          awayTeam: awayTeamObj,
          winner: result.winner,
          score: result.score,
          confidence: parseInt(result.confidence) || 70,
          date: result.date || new Date().toISOString().split('T')[0]
        };
      } catch (e) {
        console.error('Error parsing LLM response:', e);
        throw new Error('Failed to parse prediction data');
      }
    } catch (e) {
      console.error('Error getting football prediction from LLM:', e);
      throw new Error('Failed to get prediction from AI service');
    }
  }
  
  /**
   * Get an Esports match prediction
   */
  async getEsportsPrediction(game: string, team1: string, team2: string): Promise<Partial<EsportsPrediction>> {
    try {
      console.log(`Getting LLM prediction for Esports match: ${team1} vs ${team2} in ${game}`);
      
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I will give you the name of two esports teams and the game they are playing, and you will predict the winner of the match. Tell me the winner team name, the score, the confidence of the prediction, the date of the match, and the MVP player in the following JSON format: {"winner": "team name", "score": "score", "confidence": confidence percentage, "date": "date", "mvp": "player name"}. The match is: ${team1} vs ${team2} in ${game}.`
          }
        ],
        model: this.model
      });
      
      console.log("LLM response received for Esports prediction");
      const content = completion.choices[0]?.message?.content || '{}';
      
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{.*\}/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        const result = JSON.parse(jsonStr);
        
        console.log("Parsed LLM Esports result:", result);
        
        // Create team objects
        const team1Obj: Team = { name: team1 };
        const team2Obj: Team = { name: team2 };
        
        return {
          id: `${Date.now()}`,
          team1: team1Obj,
          team2: team2Obj,
          game: game,
          winner: result.winner,
          score: result.score,
          confidence: parseInt(result.confidence) || 75,
          date: result.date || new Date().toISOString().split('T')[0],
          mvp: result.mvp || 'Unknown'
        };
      } catch (e) {
        console.error('Error parsing LLM response for Esports prediction:', e);
        throw new Error('Failed to parse Esports prediction data');
      }
    } catch (e) {
      console.error('Error getting Esports prediction from LLM:', e);
      throw new Error('Failed to get Esports prediction from AI service');
    }
  }
}

/**
 * React hook for using the LLM Prediction service
 */
export const useLLMPrediction = () => {
  return new LLMPredictionService();
};