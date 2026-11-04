import React, { useState, useCallback } from 'react';
import TopToolbar from './components/TopToolbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Viewer3D from './components/Viewer3D';
import AdminCatalogModal from './components/AdminCatalogModal';
import EstimatePrintModal from './components/EstimatePrintModal';
import { SAMPLE_DESIGNS } from './data/samples';
import {
  loadCatalogFromStorage,
  saveCatalogToStorage,
  resetCatalogToDefaults
} from './data/furnitureCatalog';
import './styles/app.css';

const PROJECT_STORAGE_KEY = 'interior_studio_active_project_v2';

function loadInitialProject() {
  try {
    const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.rooms) && parsed.rooms.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load saved project:', err);
  }
  // Default to Contemporary Living Room sample
  const initialSample = SAMPLE_DESIGNS[0];
  return {
    id: 'proj_' + Date.now(),
    name: initialSample.name,
    version: '2.0',
    unit: 'mm',
    rooms: JSON.parse(JSON.stringify(initialSample.rooms)),
    stagedFurniture: JSON.parse(JSON.stringify(initialSample.stagedFurniture))
  };
}

export default function App() {
  const [project, setProject] = useState(loadInitialProject);
  const [currentUnit, setCurrentUnit] = useState(project.unit || 'mm');
  const [navMode, setNavMode] = useState('orbit'); // 'orbit' | 'fps'
  const [orbitAngle, setOrbitAngle] = useState('perspective');
  const [showCeiling, setShowCeiling] = useState(true);

  // Selection states
  const [selectedWall, setSelectedWall] = useState(null);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);

  // Catalog CMS state
  const [catalog, setCatalog] = useState(loadCatalogFromStorage);

  // Modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Sync catalog updates to localStorage
  const handleUpdateCatalog = useCallback((updater) => {
    setCatalog((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      saveCatalogToStorage(updated);
      return updated;
    });
  }, []);

  const handleResetCatalog = useCallback(() => {
    const fresh = resetCatalogToDefaults();
    setCatalog(fresh);
    showToast('Furniture catalogue restored to factory defaults.');
  }, [showToast]);

  // Project unit change
  const handleChangeUnit = (newUnit) => {
    setCurrentUnit(newUnit);
    setProject((prev) => ({ ...prev, unit: newUnit }));
  };

  // Staged Furniture updates
  const handleUpdateStagedItems = useCallback((updater) => {
    setProject((prev) => {
      const currentItems = prev.stagedFurniture || [];
      const updated = typeof updater === 'function' ? updater(currentItems) : updater;
      return { ...prev, stagedFurniture: updated };
    });
  }, []);

  // Add furniture to scene from catalogue
  const handleAddFurnitureToScene = useCallback(
    (productId, customPos = null) => {
      const product = catalog.find((c) => c.id === productId);
      if (!product) return;

      const instanceId = 'furn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      let posX = customPos ? customPos.x : 0;
      let posZ = customPos ? customPos.z : 0;

      // Default to center of active/first room if no custom position provided
      if (!customPos && project.rooms?.[0]) {
        posX = project.rooms[0].position?.x || 0;
        posZ = project.rooms[0].position?.z || 0;
      }

      const newStagedItem = {
        instanceId,
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price, // Stored captured price
        unit: product.unit || 'piece',
        position: { x: posX, y: 0, z: posZ },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };

      setProject((prev) => ({
        ...prev,
        stagedFurniture: [...(prev.stagedFurniture || []), newStagedItem]
      }));

      setSelectedFurnitureId(instanceId);
      setSelectedWall(null);
      showToast(`Added "${product.name}" to room.`);
    },
    [catalog, project.rooms, showToast]
  );

  // Save project to LocalStorage
  const handleSaveProject = useCallback(() => {
    try {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project));
      showToast(`Project "${project.name}" saved successfully.`);
    } catch (err) {
      console.error('Failed to save project:', err);
      showToast('Error saving project to local storage.');
    }
  }, [project, showToast]);

  // Load predefined sample design
  const handleLoadSampleDesign = useCallback(
    (sample) => {
      if (
        window.confirm(
          `Load "${sample.name}"? This will replace the current home layout and staged furniture.`
        )
      ) {
        setProject({
          id: 'proj_' + Date.now(),
          name: sample.name,
          version: '2.0',
          unit: currentUnit,
          rooms: JSON.parse(JSON.stringify(sample.rooms)),
          stagedFurniture: JSON.parse(JSON.stringify(sample.stagedFurniture || []))
        });
        setSelectedFurnitureId(null);
        setSelectedWall(null);
        showToast(`Loaded "${sample.name}".`);
      }
    },
    [currentUnit, showToast]
  );

  // Append a room from sample to current project
  const handleAppendSampleRoom = useCallback(
    (sample) => {
      if (!sample.rooms || sample.rooms.length === 0) return;
      const roomToAppend = JSON.parse(JSON.stringify(sample.rooms[0]));
      const newRoomId = 'room_' + Date.now();
      roomToAppend.id = newRoomId;

      // Position offset to prevent overlapping
      const maxX = project.rooms.reduce(
        (max, r) => Math.max(max, (r.position?.x || 0) + (r.width || 5)),
        0
      );
      roomToAppend.position = { x: maxX + 1.0, z: 0 };

      // Map staged furniture from sample if any
      const appendedFurniture = (sample.stagedFurniture || []).map((f) => ({
        ...JSON.parse(JSON.stringify(f)),
        instanceId: 'furn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        position: {
          x: f.position.x + maxX + 1.0,
          y: f.position.y || 0,
          z: f.position.z
        }
      }));

      setProject((prev) => ({
        ...prev,
        rooms: [...prev.rooms, roomToAppend],
        stagedFurniture: [...(prev.stagedFurniture || []), ...appendedFurniture]
      }));

      showToast(`Appended "${roomToAppend.name}" to your home.`);
    },
    [project.rooms, showToast]
  );

  // Export Project JSON
  const handleExportProjectJSON = useCallback(() => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `${(project.name || 'project').toLowerCase().replace(/\s+/g, '_')}_3d.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Project exported as JSON file.');
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [project, showToast]);

  // Import Project JSON
  const handleImportProjectJSON = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!parsed.rooms || !Array.isArray(parsed.rooms)) {
            alert('Invalid project file: missing valid rooms specification.');
            return;
          }
          setProject(parsed);
          setSelectedFurnitureId(null);
          setSelectedWall(null);
          showToast(`Successfully imported "${parsed.name || 'Project'}".`);
        } catch (err) {
          alert('Could not parse JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset input
    },
    [showToast]
  );

  return (
    <div className="app-container">
      {/* Top Architectural Toolbar */}
      <TopToolbar
        projectName={project.name}
        onUpdateProjectName={(name) => setProject((prev) => ({ ...prev, name }))}
        currentUnit={currentUnit}
        onChangeUnit={handleChangeUnit}
        navMode={navMode}
        onChangeNavMode={setNavMode}
        showCeiling={showCeiling}
        onToggleCeiling={() => setShowCeiling((prev) => !prev)}
        onSaveProject={handleSaveProject}
        onOpenEstimateModal={() => setIsEstimateModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="workspace-layout">
        {/* Left Side: Direct Home Builder, Catalogue & Finishes */}
        <aside className="sidebar-pane">
          <LeftSidebar
            project={project}
            onUpdateProject={setProject}
            currentUnit={currentUnit}
            catalog={catalog}
            onAddFurnitureToScene={handleAddFurnitureToScene}
            selectedWall={selectedWall}
            onSelectWall={setSelectedWall}
            onLoadSampleDesign={handleLoadSampleDesign}
            onAppendSampleRoom={handleAppendSampleRoom}
            onExportProjectJSON={handleExportProjectJSON}
            onImportProjectJSON={handleImportProjectJSON}
          />
        </aside>

        {/* Center: Interactive 3D Three.js Viewport */}
        <section className="viewport-pane">
          <Viewer3D
            project={project}
            navMode={navMode}
            onNavModeChange={setNavMode}
            orbitAngle={orbitAngle}
            onOrbitAngleChange={setOrbitAngle}
            showCeiling={showCeiling}
            selectedWall={selectedWall}
            onSelectWall={setSelectedWall}
            selectedFurnitureId={selectedFurnitureId}
            onSelectFurniture={setSelectedFurnitureId}
            stagedItems={project.stagedFurniture || []}
            onUpdateStagedItems={handleUpdateStagedItems}
            onAddFurnitureToScene={handleAddFurnitureToScene}
            catalog={catalog}
          />
        </section>

        {/* Right Side: Context Inspector & Live Cost Estimator */}
        <aside className="sidebar-pane right-pane">
          <RightSidebar
            project={project}
            stagedItems={project.stagedFurniture || []}
            onUpdateStagedItems={handleUpdateStagedItems}
            selectedFurnitureId={selectedFurnitureId}
            onSelectFurniture={setSelectedFurnitureId}
            selectedWall={selectedWall}
            onSelectWall={setSelectedWall}
            catalog={catalog}
            onOpenEstimateModal={() => setIsEstimateModalOpen(true)}
          />
        </aside>
      </main>

      {/* Admin Catalogue CMS Modal */}
      <AdminCatalogModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        catalog={catalog}
        onUpdateCatalog={handleUpdateCatalog}
        onResetCatalog={handleResetCatalog}
      />

      {/* Printable Quotation / Estimate Modal */}
      <EstimatePrintModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        project={project}
        stagedItems={project.stagedFurniture || []}
        catalog={catalog}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
