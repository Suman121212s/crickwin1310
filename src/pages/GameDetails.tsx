import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Target, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Database } from '../lib/database.types';

type Game = Database['public']['Tables']['games']['Row'];

interface MatchBet {
  id: string;
  user_id: string;
  bet_amount: number;
  status: string;
  created_at: string;
  team?: string;
  predicted_percentage?: number;
  predicted_score?: number;
  user: {
    name: string;
  };
}

export function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [game, setGame] = useState<Game | null>(null);
  const [matchBets, setMatchBets] = useState<MatchBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [betsLoading, setBetsLoading] = useState(true);
  const [betAmount, setBetAmount] = useState('');
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);

  const scoreRanges = [
    "1. Score 0 - 50",
    "2. Score 51 - 80",
    "3. Score 81 - 100",
    "4. Score 101 - 120",
    "5. Score 121 - 140",
    "6. Score 141 - 160",
    "7. Score 161 - 180",
    "8. Score 181 - 200",
    "9. Score 201 - 220",
    "10. Score 221 - 240",
    "11. Score 241 - Above",
  ];

  useEffect(() => {
    if (id) fetchGame();
    if (user) fetchUserBalance();
    if (id) fetchMatchBets();
  }, [id, user]);

  async function fetchGame() {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMatchBets() {
    if (!id) return;
    
    try {
      setBetsLoading(true);
      
      // Fetch win game bets
      const { data: winBets, error: winError } = await supabase
        .from('win_game_bets')
        .select(`
          id,
          user_id,
          bet_amount,
          status,
          created_at,
          team,
          predicted_percentage,
          user:users(name)
        `)
        .eq('game_id', id)
        .order('created_at', { ascending: false });

      // Fetch score prediction bets
      const { data: scoreBets, error: scoreError } = await supabase
        .from('score_prediction_bets')
        .select(`
          id,
          user_id,
          bet_amount,
          status,
          created_at,
          team,
          predicted_score,
          user:users(name)
        `)
        .eq('game_id', id)
        .order('created_at', { ascending: false });

      if (winError) throw winError;
      if (scoreError) throw scoreError;

      // Combine and sort all bets
      const allBets = [
        ...(winBets || []).map(bet => ({ ...bet, type: 'win' })),
        ...(scoreBets || []).map(bet => ({ ...bet, type: 'score' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setMatchBets(allBets);
    } catch (error) {
      console.error('Error fetching match bets:', error);
    } finally {
      setBetsLoading(false);
    }
  }

  async function fetchUserBalance() {
    const { data, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user?.id)
      .single();

    if (!error && data?.balance !== undefined) {
      setUserBalance(Number(data.balance));
    }
  }

  async function placeBet(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !game) return;
  
    try {
      setError('');
      setSubmitting(true);
  
      if (game.status !== 'live') {
        setError('This game is not live. You cannot place a bet.');
        return;
      }
  
      const amount = parseFloat(betAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid bet amount');
        return;
      }
  
      if (amount > userBalance) {
        setError('Insufficient balance to place the bet.');
        return;
      }
  
      if (game.type === 'win') {
        if (!prediction) {
          setError('Please select a team');
          return;
        }
  
        const { error } = await supabase.from('win_game_bets').insert({
          user_id: user.id,
          game_id: game.id,
          team: prediction,
          predicted_percentage: 50,
          bet_amount: amount
        });
  
        if (error) throw error;
      } else {
        const predictedScore = parseInt(prediction);
        if (isNaN(predictedScore) || predictedScore < 0) {
          setError('Please select a valid score range');
          return;
        }
  
        const { error } = await supabase.from('score_prediction_bets').insert({
          user_id: user.id,
          game_id: game.id,
          team: game.team!,
          predicted_score: predictedScore,
          bet_amount: amount
        });
  
        if (error) throw error;
      }
  
      navigate('/dashboard');
      await fetchMatchBets(); // Refresh bets after placing a new one
    } catch (error) {
      console.error('Error placing bet:', error);
      setError('Failed to place bet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const getScoreRangeText = (scoreIndex: number) => {
    const ranges = [
      "0 - 50", "51 - 80", "81 - 100", "101 - 120", "121 - 140",
      "141 - 160", "161 - 180", "181 - 200", "201 - 220", "221 - 240", "241+"
    ];
    return ranges[scoreIndex - 1] || "Unknown";
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-50'} flex justify-center items-center`}>
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#1A8754] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#F5B729] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-[#F5B729] mb-4" />
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Game Not Found</h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>The game you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-50'} py-12`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#0A2540] to-[#0D3158] border-[#1A3A5C]' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border overflow-hidden`}>
          <div className={`${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              {game.type === 'win' ? (
                <Trophy className="text-[#F5B729]" size={32} />
              ) : (
                <Target className="text-[#F5B729]" size={32} />
              )}
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {game.type === 'win' ? 'Match Winner Prediction' : 'Score Prediction'}
              </h1>
            </div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {new Date(game.date).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </p>
          </div>

          <div className="p-6">
            {game.type === 'win' ? (
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <div className={`w-32 h-32 mx-auto mb-3 ${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} rounded-lg p-2`}>
                    <img
                      src={game.teama_logo_url || `https://cricket.org/teams/${game.teama?.toLowerCase()}.png`}
                      alt={game.teama}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                      }}
                    />
                  </div>
                  <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{game.teama}</p>
                </div>
                <div className="text-3xl font-bold text-[#F5B729] px-6">VS</div>
                <div className="text-center flex-1">
                  <div className={`w-32 h-32 mx-auto mb-3 ${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} rounded-lg p-2`}>
                    <img
                      src={game.teamb_logo_url || `https://cricket.org/teams/${game.teamb?.toLowerCase()}.png`}
                      alt={game.teamb}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                      }}
                    />
                  </div>
                  <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{game.teamb}</p>
                </div>
              </div>
            ) : (
              <div className="text-center mb-8">
                <div className={`w-32 h-32 mx-auto mb-3 ${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} rounded-lg p-2`}>
                  <img
                    src={game.team_logo_url || `https://cricket.org/teams/${game.team?.toLowerCase()}.png`}
                    alt={game.team}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                    }}
                  />
                </div>
                <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{game.team}</p>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Select a Score Range</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {scoreRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrediction((idx + 1).toString())}
                      className={`p-3 rounded-lg text-sm transition-colors duration-300 ${
                        prediction === (idx + 1).toString()
                          ? 'bg-[#F5B729] text-[#0A2540]'
                          : theme === 'dark' 
                            ? 'bg-[#1A3A5C] text-white hover:bg-[#1A8754]'
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={placeBet} className="space-y-6">
              {game.type === 'win' && (
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Select Winning Team
                  </label>
                  <select
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    className={`w-full ${theme === 'dark' ? 'bg-[#0A1929] border-[#1A3A5C] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F5B729]`}
                    required
                  >
                    <option value="">Select a team</option>
                    <option value={game.teama}>{game.teama}</option>
                    <option value={game.teamb}>{game.teamb}</option>
                  </select>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Bet Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className={`w-full ${theme === 'dark' ? 'bg-[#0A1929] border-[#1A3A5C] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F5B729]`}
                  required
                />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Available Balance: ₹{userBalance.toFixed(2)}
                </p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#F5B729] text-[#0A2540] font-bold rounded-lg hover:bg-[#E3A82A] transition-colors duration-300 disabled:opacity-50"
              >
                {submitting ? 'Placing Bet...' : 'Place Bet'}
              </button>
            </form>
          </div>
        </div>

        {/* Match Bets Section */}
        <div className={`mt-8 ${theme === 'dark' ? 'bg-gradient-to-br from-[#0A2540] to-[#0D3158] border-[#1A3A5C]' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border overflow-hidden`}>
          <div className={`${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} p-6`}>
            <div className="flex items-center space-x-3">
              <Users className="text-[#F5B729]" size={24} />
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Match Bets ({matchBets.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {betsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="relative">
                  <div className="w-8 h-8 border-4 border-[#1A8754] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : matchBets.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>No Bets Yet</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Be the first to place a bet on this match!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchBets.map((bet) => (
                  <div
                    key={bet.id}
                    className={`${theme === 'dark' ? 'bg-[#0A1929] border-[#1A3A5C]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {bet.user.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bet.status === 'completed' ? 'bg-green-100 text-green-800' :
                            bet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                          {bet.type === 'win' ? (
                            <p>Predicted Winner: <span className="font-medium text-[#F5B729]">{bet.team}</span></p>
                          ) : (
                            <p>Predicted Score: <span className="font-medium text-[#F5B729]">{getScoreRangeText(bet.predicted_score)}</span></p>
                          )}
                          <p>Bet Amount: <span className="font-medium">₹{bet.bet_amount}</span></p>
                          <p>Placed: {new Date(bet.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          ₹{bet.bet_amount}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {bet.type === 'win' ? 'Winner Bet' : 'Score Bet'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}