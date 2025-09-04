import 'package:flutter/material.dart';

class AppTheme {
  // Primary Colors
  static const Color primaryColor = Color(0xFF2196F3);
  static const Color primaryLightColor = Color(0xFF64B5F6);
  static const Color primaryDarkColor = Color(0xFF1976D2);
  
  // Secondary Colors
  static const Color secondaryColor = Color(0xFF4CAF50);
  static const Color secondaryLightColor = Color(0xFF81C784);
  static const Color secondaryDarkColor = Color(0xFF388E3C);
  
  // Accent Colors
  static const Color accentColor = Color(0xFFFF9800);
  static const Color accentLightColor = Color(0xFFFFB74D);
  static const Color accentDarkColor = Color(0xFFF57C00);
  
  // Error Colors
  static const Color errorColor = Color(0xFFF44336);
  static const Color errorLightColor = Color(0xFFE57373);
  static const Color errorDarkColor = Color(0xFFD32F2F);
  
  // Success Colors
  static const Color successColor = Color(0xFF4CAF50);
  static const Color successLightColor = Color(0xFF81C784);
  static const Color successDarkColor = Color(0xFF388E3C);
  
  // Warning Colors
  static const Color warningColor = Color(0xFFFF9800);
  static const Color warningLightColor = Color(0xFFFFB74D);
  static const Color warningDarkColor = Color(0xFFF57C00);
  
  // Info Colors
  static const Color infoColor = Color(0xFF2196F3);
  static const Color infoLightColor = Color(0xFF64B5F6);
  static const Color infoDarkColor = Color(0xFF1976D2);
  
  // Neutral Colors
  static const Color backgroundColor = Color(0xFFFAFAFA);
  static const Color surfaceColor = Color(0xFFFFFFFF);
  static const Color cardColor = Color(0xFFFFFFFF);
  static const Color dividerColor = Color(0xFFE0E0E0);
  
  // Text Colors
  static const Color textPrimaryColor = Color(0xFF212121);
  static const Color textSecondaryColor = Color(0xFF757575);
  static const Color textDisabledColor = Color(0xFFBDBDBD);
  static const Color textHintColor = Color(0xFF9E9E9E);
  
  // Status Colors for Diabetes
  static const Color glucoseNormalColor = Color(0xFF4CAF50);
  static const Color glucoseHighColor = Color(0xFFFF9800);
  static const Color glucoseVeryHighColor = Color(0xFFF44336);
  static const Color glucoseLowColor = Color(0xFF2196F3);
  static const Color glucoseVeryLowColor = Color(0xFF9C27B0);
  
  // Role-based Colors
  static const Color patientColor = Color(0xFF2196F3);
  static const Color doctorColor = Color(0xFF4CAF50);
  static const Color nutritionistColor = Color(0xFFFF9800);
  static const Color coachColor = Color(0xFF9C27B0);
  static const Color adminColor = Color(0xFFF44336);
  static const Color familyColor = Color(0xFF607D8B);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        brightness: Brightness.light,
      ),
      
      // App Bar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.white,
          fontFamily: 'Poppins',
        ),
      ),
      
      // Card Theme
      cardTheme: CardTheme(
        color: surfaceColor,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(8),
      ),
      
      // Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: 'Poppins',
          ),
        ),
      ),
      
      // Outlined Button Theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryColor,
          side: const BorderSide(color: primaryColor, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: 'Poppins',
          ),
        ),
      ),
      
      // Text Button Theme
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            fontFamily: 'Poppins',
          ),
        ),
      ),
      
      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.grey[50],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: dividerColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: dividerColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: errorColor, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        labelStyle: const TextStyle(
          color: textSecondaryColor,
          fontSize: 16,
          fontFamily: 'Poppins',
        ),
        hintStyle: const TextStyle(
          color: textHintColor,
          fontSize: 16,
          fontFamily: 'Poppins',
        ),
      ),
      
      // Text Theme
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        displayMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        displaySmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        headlineLarge: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        headlineSmall: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        titleLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        titleMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        titleSmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textSecondaryColor,
          fontFamily: 'Poppins',
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.normal,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        bodySmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.normal,
          color: textSecondaryColor,
          fontFamily: 'Poppins',
        ),
        labelLarge: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        labelMedium: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textSecondaryColor,
          fontFamily: 'Poppins',
        ),
        labelSmall: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w500,
          color: textSecondaryColor,
          fontFamily: 'Poppins',
        ),
      ),
      
      // Icon Theme
      iconTheme: const IconThemeData(
        color: primaryColor,
        size: 24,
      ),
      
      // Floating Action Button Theme
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 4,
      ),
      
      // Bottom Navigation Bar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surfaceColor,
        selectedItemColor: primaryColor,
        unselectedItemColor: textSecondaryColor,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      
      // Drawer Theme
      drawerTheme: const DrawerThemeData(
        backgroundColor: surfaceColor,
        elevation: 16,
      ),
      
      // List Tile Theme
      listTileTheme: const ListTileThemeData(
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        titleTextStyle: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textPrimaryColor,
          fontFamily: 'Poppins',
        ),
        subtitleTextStyle: TextStyle(
          fontSize: 14,
          color: textSecondaryColor,
          fontFamily: 'Poppins',
        ),
      ),
      
      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: dividerColor,
        thickness: 1,
        space: 1,
      ),
      
      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: Colors.grey[100],
        selectedColor: primaryLightColor,
        disabledColor: Colors.grey[300],
        labelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          fontFamily: 'Poppins',
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        brightness: Brightness.dark,
      ),
      // Dark theme implementation can be added here
    );
  }
}
