import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../themes/app_theme.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Implement edit profile
              Get.snackbar('Edit Profile', 'Edit profile feature will be implemented');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Profile Header
            _buildProfileHeader(authController),
            
            const SizedBox(height: 24),
            
            // Profile Information
            _buildProfileInfo(authController),
            
            const SizedBox(height: 24),
            
            // Settings Section
            _buildSettingsSection(context, authController),
            
            const SizedBox(height: 24),
            
            // Logout Button
            _buildLogoutButton(authController),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(AuthController authController) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: AppTheme.primaryLightColor,
              child: Icon(
                Icons.person,
                size: 60,
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              authController.userName,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getRoleColor(authController.userRole).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _getRoleColor(authController.userRole).withOpacity(0.3),
                ),
              ),
              child: Text(
                _getRoleDisplayName(authController.userRole),
                style: TextStyle(
                  color: _getRoleColor(authController.userRole),
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              authController.userEmail,
              style: TextStyle(
                color: AppTheme.textSecondaryColor,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileInfo(AuthController authController) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Account Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimaryColor,
              ),
            ),
          ),
          const Divider(height: 1),
          _buildInfoTile(
            'User ID',
            authController.currentUser?.id.toString() ?? 'N/A',
            Icons.badge,
          ),
          _buildInfoTile(
            'Role',
            _getRoleDisplayName(authController.userRole),
            Icons.work,
          ),
          _buildInfoTile(
            'Email',
            authController.userEmail,
            Icons.email,
          ),
          _buildInfoTile(
            'Member Since',
            _formatDate(authController.currentUser?.createdAt),
            Icons.calendar_today,
          ),
          _buildInfoTile(
            'Last Updated',
            _formatDate(authController.currentUser?.updatedAt),
            Icons.update,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String title, String value, IconData icon) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryColor),
      title: Text(
        title,
        style: TextStyle(
          color: AppTheme.textSecondaryColor,
          fontSize: 14,
        ),
      ),
      subtitle: Text(
        value,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildSettingsSection(BuildContext context, AuthController authController) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Settings & Preferences',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimaryColor,
              ),
            ),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.notifications, color: AppTheme.primaryColor),
            title: const Text('Notifications'),
            subtitle: const Text('Manage your notification preferences'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              Get.snackbar('Notifications', 'Notification settings will be implemented');
            },
          ),
          ListTile(
            leading: const Icon(Icons.security, color: AppTheme.primaryColor),
            title: const Text('Privacy & Security'),
            subtitle: const Text('Manage your privacy settings'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              Get.snackbar('Privacy', 'Privacy settings will be implemented');
            },
          ),
          ListTile(
            leading: const Icon(Icons.language, color: AppTheme.primaryColor),
            title: const Text('Language'),
            subtitle: const Text('English'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              Get.snackbar('Language', 'Language settings will be implemented');
            },
          ),
          ListTile(
            leading: const Icon(Icons.help, color: AppTheme.primaryColor),
            title: const Text('Help & Support'),
            subtitle: const Text('Get help and contact support'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              Get.snackbar('Help', 'Help & support will be implemented');
            },
          ),
          ListTile(
            leading: const Icon(Icons.info, color: AppTheme.primaryColor),
            title: const Text('About'),
            subtitle: const Text('App version and information'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              _showAboutDialog(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(AuthController authController) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => _showLogoutDialog(authController),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.errorColor,
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
        child: const Text(
          'Logout',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog(AuthController authController) {
    Get.dialog(
      AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Get.back();
              authController.logout();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
            ),
            child: const Text(
              'Logout',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('About Diabetic App'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Version: 1.0.0'),
            SizedBox(height: 8),
            Text('A comprehensive diabetes management application designed to help patients, healthcare providers, and families track and manage diabetes care.'),
            SizedBox(height: 16),
            Text('Features:'),
            Text('• Glucose monitoring'),
            Text('• HbA1c tracking'),
            Text('• Nutrition logging'),
            Text('• Exercise tracking'),
            Text('• Community support'),
            Text('• Professional guidance'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Color _getRoleColor(String role) {
    switch (role) {
      case 'patient':
        return AppTheme.patientColor;
      case 'doctor':
        return AppTheme.doctorColor;
      case 'nutritionist':
        return AppTheme.nutritionistColor;
      case 'coach':
        return AppTheme.coachColor;
      case 'admin':
        return AppTheme.adminColor;
      case 'family':
        return AppTheme.familyColor;
      default:
        return AppTheme.primaryColor;
    }
  }

  String _getRoleDisplayName(String role) {
    switch (role) {
      case 'patient':
        return 'Patient';
      case 'doctor':
        return 'Doctor';
      case 'nutritionist':
        return 'Nutritionist';
      case 'coach':
        return 'Coach';
      case 'admin':
        return 'Administrator';
      case 'family':
        return 'Family Member';
      default:
        return 'User';
    }
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'N/A';
    return '${date.day}/${date.month}/${date.year}';
  }
}
