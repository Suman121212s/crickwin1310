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
  type: 'win' | 'score';
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
  const [totalVolume, setTotalVolume] = useState(0);
  const [teamAVolume, setTeamAVolume] = useState(0);
  const [teamBVolume, setTeamBVolume] = useState(0);

  const scoreRanges = [
    "0 - 50", "51 - 80", "81 - 100", "101 - 120", "121 - 140",
    "141 - 160", "161 - 180", "181 - 200", "201 - 220", "221 - 240", "241+"
  ];

  useEffect(() => {
    if (id) fetchGame();
    if (user) fetchUserBalance();
    if (id) fetchMatchBets();
  }, [id, user]);

  async function fetchGame() {
    try {
      const { data, error } = await supabase.from('games').select('*').eq('id', id).single();
      if (error) throw error;
      setGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserBalance() {
    if (!user) return;
    const { data, error } = await supabase.from('users').select('balance').eq('id', user.id).single();
    if (!error && data?.balance !== undefined) setUserBalance(Number(data.balance));
  }

  async function fetchMatchBets() {
    if (!id) return;

    try {
      setBetsLoading(true);
      const { data: winBets } = await supabase
        .from('win_game_bets')
        .select('id, user_id, bet_amount, status, created_at, team, predicted_percentage, user:users(name)')
        .eq('game_id', id)
        .order('created_at', { ascending: false });

      const { data: scoreBets } = await supabase
        .from('score_prediction_bets')
        .select('id, user_id, bet_amount, status, created_at, team, predicted_score, user:users(name)')
        .eq('game_id', id)
        .order('created_at', { ascending: false });

      const allBets = [
        ...(winBets || []).map(b => ({ ...b, type: 'win' as const })),
        ...(scoreBets || []).map(b => ({ ...b, type: 'score' as const }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setMatchBets(allBets);

      // Volume cards
      const total = allBets.reduce((sum, b) => sum + Number(b.bet_amount || 0), 0);
      const teamA = allBets.filter(b => b.team === game?.teama).reduce((sum, b) => sum + Number(b.bet_amount || 0), 0);
      const teamB = allBets.filter(b => b.team === game?.teamb).reduce((sum, b) => sum + Number(b.bet_amount || 0), 0);
      setTotalVolume(total);
      setTeamAVolume(teamA);
      setTeamBVolume(teamB);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setBetsLoading(false);
    }
  }

  async function placeBet(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !game) return;

    try {
      setError('');
      setSubmitting(true);

      if (game.status !== 'live') {
        setError('This game is not live.');
        return;
      }

      const amount = parseFloat(betAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Enter a valid amount');
        return;
      }
      if (amount > userBalance) {
        setError('Insufficient balance');
        return;
      }

      if (game.type === 'win') {
        if (!prediction) {
          setError('Select a team');
          return;
        }
        await supabase.from('win_game_bets').insert({
          user_id: user.id,
          game_id: game.id,
          team: prediction,
          predicted_percentage: 50,
          bet_amount: amount
        });
      } else {
        const predictedScore = parseInt(prediction);
        if (isNaN(predictedScore)) {
          setError('Select a valid score range');
          return;
        }
        await supabase.from('score_prediction_bets').insert({
          user_id: user.id,
          game_id: game.id,
          team: game.team!,
          predicted_score: predictedScore,
          bet_amount: amount
        });
      }

      await fetchMatchBets();
      await fetchUserBalance();
      setBetAmount('');
      setPrediction('');
    } catch (error) {
      console.error('Error placing bet:', error);
      setError('Failed to place bet.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#1A8754] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!game)
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-[#F5B729]" />
        <h2 className="text-xl font-semibold mt-4">Game Not Found</h2>
      </div>
    );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-50'} py-8`}>
      {/* --- Volume Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-[#102843]' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-lg font-semibold text-[#F5B729] mb-2">Total Volume</h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{totalVolume.toFixed(2)}</p>
        </div>
        <div className={`${theme === 'dark' ? 'bg-[#102843]' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-lg font-semibold text-[#1A8754] mb-2">{game.teama} Volume</h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{teamAVolume.toFixed(2)}</p>
        </div>
        <div className={`${theme === 'dark' ? 'bg-[#102843]' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-lg font-semibold text-[#E74C3C] mb-2">{game.teamb} Volume</h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{teamBVolume.toFixed(2)}</p>
        </div>
      </div>

      {/* --- Game Detail --- */}
      <div className="max-w-5xl mx-auto px-6">
        <div className={`${theme === 'dark' ? 'bg-[#0D3158]' : 'bg-white'} rounded-xl shadow-xl border p-6`}>
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            {game.type === 'win' ? <Trophy className="text-[#F5B729]" size={28} /> : <Target className="text-[#F5B729]" size={28} />}
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {game.type === 'win' ? 'Match Winner Prediction' : 'Score Prediction'}
            </h1>
          </div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {new Date(game.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
          </p>

          {/* --- Game Section --- */}
          {game.type === 'win' ? (
            <div className="flex items-center justify-between mt-6">
              {[game.teama, game.teamb].map((team, i) => (
                <div key={i} className="text-center flex-1">
                  <div className={`w-28 h-28 mx-auto mb-3 ${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} rounded-lg p-2`}>
                    <img src={i === 0 ? game.teama_logo_url : game.teamb_logo_url} alt={team!} className="w-full h-full object-contain" />
                  </div>
                  <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{team}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-6">
              <div className={`w-28 h-28 mx-auto mb-3 ${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-100'} rounded-lg p-2`}>
                <img src={game.team_logo_url} alt={game.team!} className="w-full h-full object-contain" />
              </div>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{game.team}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {scoreRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrediction((idx + 1).toString())}
                    className={`p-3 rounded-lg text-sm transition-colors ${
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

          {/* --- Bet Form --- */}
          <form onSubmit={placeBet} className="mt-8 space-y-6">
            {game.type === 'win' && (
              <div>
                <label className="block text-sm mb-2">Select Winning Team</label>
                <select
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  className={`w-full border rounded-lg px-4 py-2 ${
                    theme === 'dark' ? 'bg-[#0A1929] border-[#1A3A5C] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select</option>
                  <option value={game.teama}>{game.teama}</option>
                  <option value={game.teamb}>{game.teamb}</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Bet Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2 ${
                  theme === 'dark' ? 'bg-[#0A1929] border-[#1A3A5C] text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className="text-sm text-gray-400 mt-1">Available: ₹{userBalance.toFixed(2)}</p>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#F5B729] text-[#0A2540] font-bold rounded-lg hover:bg-[#E3A82A] transition disabled:opacity-50"
            >
              {submitting ? 'Placing Bet...' : 'Place Bet'}
            </button>
          </form>
        </div>

        {/* --- Match Bets List --- */}
        <div
          className={`mt-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0A2540] to-[#0D3158]'
              : 'bg-white'
          } border rounded-xl shadow-xl`}
        >
          <div className="p-6 border-b border-gray-700 flex items-center space-x-3">
            <Users className="text-[#F5B729]" size={22} />
            <h2 className="text-lg font-bold">Match Bets ({matchBets.length})</h2>
          </div>

          <div className="p-6">
            {betsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-[#1A8754] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : matchBets.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p>No Bets Yet — be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchBets.map((bet) => (
                  <div key={bet.id} className="border rounded-lg p-4 bg-opacity-30">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{bet.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {bet.type === 'win'
                            ? `Predicted Winner: ${bet.team}`
                            : `Predicted Score: ${scoreRanges[(bet.predicted_score || 1) - 1]}`}
                        </p>
                        <p className="text-sm">₹{bet.bet_amount}</p>
                        <p className="text-xs text-gray-400">{new Date(bet.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            bet.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : bet.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {bet.status}
                        </span>
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
