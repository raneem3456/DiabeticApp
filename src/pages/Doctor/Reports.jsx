import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { doctorAPI } from '../../api/doctor';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Reports.module.css';

const Reports = () => {
  const { user } = useAuthStore();
  const [patientStats, setPatientStats] = useState(null);
  const [diabetesTypeReport, setDiabetesTypeReport] = useState(null);
  const [ageGroupReport, setAgeGroupReport] = useState(null);
  const [activeTab, setActiveTab] = useState('statistics');
  const { loading, error, callApi } = useApi();

  const fetchReports = async () => {
    try {
      const [statsData, diabetesData, ageData] = await Promise.all([
        callApi(doctorAPI.getPatientStatistics),
        callApi(doctorAPI.getDiabetesTypeReport),
        callApi(doctorAPI.getAgeGroupReport)
      ]);
      
      setPatientStats(statsData);
      setDiabetesTypeReport(diabetesData);
      setAgeGroupReport(ageData);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (user?.role !== 'doctor') {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Reports & Analytics</h1>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'statistics' ? styles.active : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            📊 Statistics
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'diabetes' ? styles.active : ''}`}
            onClick={() => setActiveTab('diabetes')}
          >
            🩸 Diabetes Types
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'age' ? styles.active : ''}`}
            onClick={() => setActiveTab('age')}
          >
            👥 Age Groups
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading reports...</p>
        </div>
      ) : (
        <div className={styles.content}>
          {activeTab === 'statistics' && patientStats && (
            <div className={styles.reportSection}>
              <h2>Patient Statistics Overview</h2>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statContent}>
                    <h3>Total Patients</h3>
                    <p>{patientStats.total_patients || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📈</div>
                  <div className={styles.statContent}>
                    <h3>Active Patients</h3>
                    <p>{patientStats.active_patients || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🩸</div>
                  <div className={styles.statContent}>
                    <h3>Avg Glucose</h3>
                    <p>{patientStats.average_glucose || 0} mg/dL</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📊</div>
                  <div className={styles.statContent}>
                    <h3>Avg HbA1c</h3>
                    <p>{patientStats.average_hba1c || 0}%</p>
                  </div>
                </div>
              </div>

              {patientStats.glucose_trends && (
                <div className={styles.chartContainer}>
                  <h3>Glucose Trends (Last 30 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientStats.glucose_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="min" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {patientStats.monthly_registrations && (
                <div className={styles.chartContainer}>
                  <h3>New Patient Registrations</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={patientStats.monthly_registrations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'diabetes' && diabetesTypeReport && (
            <div className={styles.reportSection}>
              <h2>Diabetes Type Distribution</h2>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🩸</div>
                  <div className={styles.statContent}>
                    <h3>Type 1 Diabetes</h3>
                    <p>{diabetesTypeReport.type_1_count || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💊</div>
                  <div className={styles.statContent}>
                    <h3>Type 2 Diabetes</h3>
                    <p>{diabetesTypeReport.type_2_count || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🤱</div>
                  <div className={styles.statContent}>
                    <h3>Gestational</h3>
                    <p>{diabetesTypeReport.gestational_count || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>❓</div>
                  <div className={styles.statContent}>
                    <h3>Other Types</h3>
                    <p>{diabetesTypeReport.other_count || 0}</p>
                  </div>
                </div>
              </div>

              {diabetesTypeReport.distribution && (
                <div className={styles.chartContainer}>
                  <h3>Diabetes Type Distribution</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={diabetesTypeReport.distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diabetesTypeReport.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {diabetesTypeReport.type_comparison && (
                <div className={styles.chartContainer}>
                  <h3>Average Metrics by Diabetes Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={diabetesTypeReport.type_comparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg_glucose" fill="#3b82f6" name="Avg Glucose" />
                      <Bar dataKey="avg_hba1c" fill="#10b981" name="Avg HbA1c" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'age' && ageGroupReport && (
            <div className={styles.reportSection}>
              <h2>Age Group Analysis</h2>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👶</div>
                  <div className={styles.statContent}>
                    <h3>Under 18</h3>
                    <p>{ageGroupReport.under_18_count || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👨‍🎓</div>
                  <div className={styles.statContent}>
                    <h3>18-30</h3>
                    <p>{ageGroupReport.age_18_30_count || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👨‍💼</div>
                  <div className={styles.statContent}>
                    <h3>31-50</h3>
                    <p>{ageGroupReport.age_31_50_count || 0}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👴</div>
                  <div className={styles.statContent}>
                    <h3>Over 50</h3>
                    <p>{ageGroupReport.over_50_count || 0}</p>
                  </div>
                </div>
              </div>

              {ageGroupReport.age_distribution && (
                <div className={styles.chartContainer}>
                  <h3>Age Group Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageGroupReport.age_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age_group" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {ageGroupReport.age_metrics && (
                <div className={styles.chartContainer}>
                  <h3>Health Metrics by Age Group</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageGroupReport.age_metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age_group" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg_glucose" fill="#3b82f6" name="Avg Glucose" />
                      <Bar dataKey="avg_hba1c" fill="#10b981" name="Avg HbA1c" />
                      <Bar dataKey="avg_bmi" fill="#f59e0b" name="Avg BMI" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {ageGroupReport.age_trends && (
                <div className={styles.chartContainer}>
                  <h3>Age Group Trends Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ageGroupReport.age_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="under_18" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="age_18_30" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="age_31_50" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="over_50" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
