import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { patientAPI } from '../../api/patient.js';
import { useApi } from '../../hooks/useApi.js';
import { formatDate, formatGlucoseValue, getGlucoseStatus, getGlucoseStatusColor } from '../../utils/helpers.js';
import styles from './PatientDashboard.module.css';

const PatientDashboard = () => {
  const { callApi } = useApi();
  const [glucoseReadings, setGlucoseReadings] = useState([]);
  const [moods, setMoods] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [glucoseData, moodsData, nutritionData, workoutData] = await Promise.all([
        callApi(() => patientAPI.getGlucoseReadings()),
        callApi(() => patientAPI.getMoods()),
        callApi(() => patientAPI.getNutritionLogs()),
        callApi(() => patientAPI.getWorkoutLogs()),
      ]);

      setGlucoseReadings(glucoseData?.data || []);
      setMoods(moodsData?.data || []);
      setNutritionLogs(nutritionData?.data || []);
      setWorkoutLogs(workoutData?.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const glucoseChartData = glucoseReadings.slice(-7).map(reading => ({
    date: formatDate(reading.created_at),
    value: reading.value,
    status: getGlucoseStatus(reading.value, reading.unit),
  }));

  const moodChartData = moods.slice(-7).map(mood => ({
    date: formatDate(mood.created_at),
    level: mood.level,
  }));

  const nutritionChartData = nutritionLogs.slice(-7).map(log => ({
    date: formatDate(log.created_at),
    calories: log.calories || 0,
  }));

  const workoutChartData = workoutLogs.slice(-7).map(log => ({
    date: formatDate(log.created_at),
    duration: log.duration || 0,
  }));

  // Calculate statistics
  const latestGlucose = glucoseReadings[glucoseReadings.length - 1];
  const averageGlucose = glucoseReadings.length > 0 
    ? glucoseReadings.reduce((sum, reading) => sum + reading.value, 0) / glucoseReadings.length 
    : 0;
  
  const averageMood = moods.length > 0 
    ? moods.reduce((sum, mood) => sum + mood.level, 0) / moods.length 
    : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.patientDashboard}>
      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🩸</div>
          <div className={styles.statContent}>
            <h3>Latest Glucose</h3>
            <p className={styles.statValue}>
              {latestGlucose ? formatGlucoseValue(latestGlucose.value, latestGlucose.unit) : 'No data'}
            </p>
            {latestGlucose && (
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getGlucoseStatusColor(getGlucoseStatus(latestGlucose.value, latestGlucose.unit)) }}
              >
                {getGlucoseStatus(latestGlucose.value, latestGlucose.unit)}
              </span>
            )}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Average Glucose</h3>
            <p className={styles.statValue}>
              {averageGlucose > 0 ? `${Math.round(averageGlucose)} mg/dL` : 'No data'}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>😊</div>
          <div className={styles.statContent}>
            <h3>Average Mood</h3>
            <p className={styles.statValue}>
              {averageMood > 0 ? `${averageMood.toFixed(1)}/5` : 'No data'}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>Total Readings</h3>
            <p className={styles.statValue}>{glucoseReadings.length}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Glucose Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={glucoseChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#667eea" 
                strokeWidth={2}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Mood Tracking (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="level" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Nutrition Log (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Workout Duration (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="duration" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <h3>Recent Activity</h3>
        <div className={styles.activityList}>
          {glucoseReadings.slice(0, 5).map((reading, index) => (
            <div key={reading.id || index} className={styles.activityItem}>
              <div className={styles.activityIcon}>🩸</div>
              <div className={styles.activityContent}>
                <p>Glucose reading: {formatGlucoseValue(reading.value, reading.unit)}</p>
                <span className={styles.activityTime}>
                  {formatDate(reading.created_at)}
                </span>
              </div>
            </div>
          ))}
          
          {moods.slice(0, 3).map((mood, index) => (
            <div key={mood.id || index} className={styles.activityItem}>
              <div className={styles.activityIcon}>😊</div>
              <div className={styles.activityContent}>
                <p>Mood recorded: {mood.level}/5</p>
                <span className={styles.activityTime}>
                  {formatDate(mood.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
