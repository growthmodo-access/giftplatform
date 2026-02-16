'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Edit, Trash2, MoreVertical } from 'lucide-react'
import { getTeams, createTeam, updateTeam, deleteTeam } from '@/actions/teams'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CreateTeamDialog } from './create-team-dialog'
import { EditTeamDialog } from './edit-team-dialog'

interface TeamsSectionProps {
  currentUserRole: AppRole
}

export function TeamsSection({ currentUserRole }: TeamsSectionProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null)

  const canManageTeams = currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    setLoading(true)
    const result = await getTeams()
    if (result.data) {
      setTeams(result.data)
    }
    setLoading(false)
  }

  const handleDeleteTeam = async (teamId: string) => {
    const result = await deleteTeam(teamId)
    setDeleteDialogOpen(null)
    
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    } else {
      toast({
        variant: 'success',
        title: 'Team Deleted',
        description: 'Team deleted successfully.',
      })
      loadTeams()
    }
  }

  if (!canManageTeams) {
    return null
  }

  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg lg:text-xl">Teams</CardTitle>
              <CardDescription className="text-sm">
                Group employees into teams for targeted campaigns
              </CardDescription>
            </div>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No teams created yet.</p>
              <p className="text-sm mt-2">Create your first team to group employees.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Card key={team.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{team.name}</CardTitle>
                        {team.description && (
                          <CardDescription className="text-xs mt-1">
                            {team.description}
                          </CardDescription>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedTeam(team)
                            setEditDialogOpen(true)
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {(currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN') && (
                            <DropdownMenuItem
                              onClick={() => setDeleteDialogOpen(team.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {team.member_count || 0} {team.member_count === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTeamDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open)
          if (!open) loadTeams()
        }}
      />

      {selectedTeam && (
        <EditTeamDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open)
            if (!open) {
              setSelectedTeam(null)
              loadTeams()
            }
          }}
          team={selectedTeam}
        />
      )}

      {deleteDialogOpen && (
        <AlertDialog open={!!deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Team</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this team? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDialogOpen && handleDeleteTeam(deleteDialogOpen)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
