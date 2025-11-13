import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Mission, MissionCategory } from '../types';
import { Input, Button } from './';
import { colors, spacing, typography, borderRadius } from '../theme';

export interface MissionFormData {
  title: string;
  description: string;
  date: Date;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  pointsReward: number;
  category: MissionCategory;
  maxParticipants?: number;
  sponsorId?: string;
  imageUris?: string[];
}

interface MissionFormProps {
  initialData?: Partial<Mission>;
  onSubmit: (data: MissionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  uploadProgress?: number;
}

const CATEGORIES: { label: string; value: MissionCategory }[] = [
  { label: 'Volunteer', value: 'volunteer' },
  { label: 'Donation', value: 'donation' },
  { label: 'Charity', value: 'charity' },
  { label: 'Blood Drive', value: 'blood_drive' },
  { label: 'Other', value: 'other' },
];

export const MissionForm: React.FC<MissionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  uploadProgress = 0,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(
    initialData?.date ? initialData.date.toDate() : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [address, setAddress] = useState(initialData?.location?.address || '');
  const [city, setCity] = useState(initialData?.location?.city || '');
  const [latitude, setLatitude] = useState(
    initialData?.location?.coordinates?.latitude?.toString() || ''
  );
  const [longitude, setLongitude] = useState(
    initialData?.location?.coordinates?.longitude?.toString() || ''
  );
  const [pointsReward, setPointsReward] = useState(
    initialData?.pointsReward?.toString() || ''
  );
  const [category, setCategory] = useState<MissionCategory>(
    initialData?.category || 'volunteer'
  );
  const [maxParticipants, setMaxParticipants] = useState(
    initialData?.maxParticipants?.toString() || ''
  );
  const [sponsorId, setSponsorId] = useState(initialData?.sponsorId || '');
  const [imageUris, setImageUris] = useState<string[]>(
    initialData?.imageUrls || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Valid latitude is required (-90 to 90)';
    }

    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = 'Valid longitude is required (-180 to 180)';
    }

    const points = parseInt(pointsReward, 10);
    if (isNaN(points) || points <= 0) {
      newErrors.pointsReward = 'Points reward must be greater than 0';
    }

    if (maxParticipants && parseInt(maxParticipants, 10) <= 0) {
      newErrors.maxParticipants = 'Max participants must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    const formData: MissionFormData = {
      title: title.trim(),
      description: description.trim(),
      date,
      location: {
        address: address.trim(),
        city: city.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      pointsReward: parseInt(pointsReward, 10),
      category,
      maxParticipants: maxParticipants
        ? parseInt(maxParticipants, 10)
        : undefined,
      sponsorId: sponsorId.trim() || undefined,
      imageUris: imageUris.length > 0 ? imageUris : undefined,
    };

    onSubmit(formData);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5 - imageUris.length,
    });

    if (result.assets) {
      const newUris = result.assets
        .map(asset => asset.uri)
        .filter((uri): uri is string => uri !== undefined);
      setImageUris([...imageUris, ...newUris]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUris(imageUris.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <Input
        label="Mission Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter mission title"
        error={errors.title}
        editable={!loading}
      />

      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter mission description"
        multiline
        numberOfLines={4}
        error={errors.description}
        editable={!loading}
        style={styles.textArea}
      />

      <Text style={styles.sectionTitle}>Date & Time</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
        disabled={loading}
      >
        <Text style={styles.dateButtonLabel}>Date</Text>
        <Text style={styles.dateButtonValue}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowTimePicker(true)}
        disabled={loading}
      >
        <Text style={styles.dateButtonLabel}>Time</Text>
        <Text style={styles.dateButtonValue}>{date.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.sectionTitle}>Location</Text>

      <Input
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Enter street address"
        error={errors.address}
        editable={!loading}
      />

      <Input
        label="City"
        value={city}
        onChangeText={setCity}
        placeholder="Enter city"
        error={errors.city}
        editable={!loading}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Input
            label="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            placeholder="e.g., 25.0330"
            keyboardType="numeric"
            error={errors.latitude}
            editable={!loading}
          />
        </View>
        <View style={styles.halfWidth}>
          <Input
            label="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            placeholder="e.g., 121.5654"
            keyboardType="numeric"
            error={errors.longitude}
            editable={!loading}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mission Details</Text>

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryButton,
              category === cat.value && styles.categoryButtonActive,
            ]}
            onPress={() => setCategory(cat.value)}
            disabled={loading}
          >
            <Text
              style={[
                styles.categoryButtonText,
                category === cat.value && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Points Reward"
        value={pointsReward}
        onChangeText={setPointsReward}
        placeholder="Enter points reward"
        keyboardType="numeric"
        error={errors.pointsReward}
        editable={!loading}
      />

      <Input
        label="Max Participants (Optional)"
        value={maxParticipants}
        onChangeText={setMaxParticipants}
        placeholder="Leave empty for unlimited"
        keyboardType="numeric"
        error={errors.maxParticipants}
        editable={!loading}
      />

      <Input
        label="Sponsor ID (Optional)"
        value={sponsorId}
        onChangeText={setSponsorId}
        placeholder="Enter company sponsor ID"
        editable={!loading}
      />

      <Text style={styles.sectionTitle}>Images</Text>

      <View style={styles.imageContainer}>
        {imageUris.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => handleRemoveImage(index)}
              disabled={loading}
            >
              <Text style={styles.removeImageText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {imageUris.length < 5 && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleImagePicker}
            disabled={loading}
          >
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && uploadProgress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${uploadProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            Uploading... {Math.round(uploadProgress)}%
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="secondary"
          disabled={loading}
          style={styles.button}
        />
        <Button
          title={initialData ? 'Update Mission' : 'Create Mission'}
          onPress={handleSubmit}
          disabled={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  dateButtonLabel: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  dateButtonValue: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  categoryButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.gray300,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  addImageText: {
    fontSize: 32,
    color: colors.gray400,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  button: {
    flex: 1,
  },
});
