      // In a real app, this would be an API call to update the appointment notes
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app.id === selectedAppointment.id ? { ...app, notes: notesText } : app
              onClick={() => setFilter(option as 'all' | 'upcoming' | 'past')}
      )
      setSelectedAppointment({ ...selectedAppointment, notes: notesText })
      setShowNotes(false)
    } catch (error: unknown) {
      console.error('Failed to save notes', error)
