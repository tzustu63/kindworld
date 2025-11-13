import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import EventFeedScreen from './EventFeedScreen';
import { FilterModal, FilterOptions, SortModal, SortOption } from '../components';
import { useMissions } from '../hooks';
import { useMonitoring } from '../hooks/useMonitoring';
import { AnalyticsEvent } from '../services/monitoringService';

const EventFeedScreenContainer: React.FC = () => {
  const navigation = useNavigation();
  const {
    missions,
    favorites,
    loading,
    filters,
    sortBy,
    applyFilters,
    applySort,
    toggleFavorite,
  } = useMissions();

  // Add monitoring
  const { logEvent } = useMonitoring({
    screenName: 'EventFeed',
    trackScreenView: true,
    measureLoadTime: true,
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleSortPress = () => {
    setSortModalVisible(true);
  };

  const handleLocationEdit = () => {
    // TODO: Implement location editing
    console.log('Edit location');
  };

  const handleMissionPress = (missionId: string) => {
    // Log mission view
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      logEvent(AnalyticsEvent.MISSION_VIEW, {
        mission_id: missionId,
        mission_title: mission.title,
        mission_category: mission.category,
      });
    }
    
    // Navigate to mission detail screen
    navigation.navigate('MissionDetail' as never, { missionId } as never);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    applyFilters(newFilters);
    
    // Log filter usage
    logEvent(AnalyticsEvent.MISSION_FILTER, {
      category: newFilters.category,
      date_range: newFilters.dateRange,
      distance: newFilters.distance,
    });
  };

  const handleApplySort = (newSortBy: SortOption) => {
    applySort(newSortBy);
    
    // Log sort usage
    logEvent(AnalyticsEvent.MISSION_SORT, {
      sort_by: newSortBy,
    });
  };

  return (
    <>
      <EventFeedScreen
        missions={missions}
        loading={loading}
        onFilterPress={handleFilterPress}
        onSortPress={handleSortPress}
        onLocationEdit={handleLocationEdit}
        onMissionPress={handleMissionPress}
        onFavoriteToggle={toggleFavorite}
        favorites={favorites}
      />
      <FilterModal
        visible={filterModalVisible}
        currentFilters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />
      <SortModal
        visible={sortModalVisible}
        currentSort={sortBy}
        onClose={() => setSortModalVisible(false)}
        onApply={handleApplySort}
      />
    </>
  );
};

export default EventFeedScreenContainer;
