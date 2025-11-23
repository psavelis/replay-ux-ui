/**
 * Review & Confirm Step - Final wizard step
 * Shows summary of all selections before submitting
 */

'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Divider, Chip } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useWizard } from './wizard-context';

const DISTRIBUTION_NAMES = {
  winner_takes_all: 'Winner Takes All',
  top_three_split_60_30_10: 'Top 3 Split (60/30/10)',
  performance_mvp_70_20_10: 'Performance MVP (70/20/10)',
};

export default function ReviewConfirmForm() {
  const { state } = useWizard();

  const sections = [
    {
      icon: 'solar:global-bold-duotone',
      title: 'Region',
      value: state.region || 'Not selected',
      color: 'primary',
    },
    {
      icon: 'solar:gameboy-bold-duotone',
      title: 'Game Mode',
      value: state.gameMode || 'Not selected',
      color: 'secondary',
    },
    {
      icon: 'solar:users-group-two-rounded-bold-duotone',
      title: 'Team',
      value: state.teamType
        ? `${state.teamType.charAt(0).toUpperCase() + state.teamType.slice(1)}${
            state.selectedFriends?.length ? ` (${state.selectedFriends.length} friends)` : ''
          }`
        : 'Solo',
      color: 'success',
    },
    {
      icon: 'solar:cup-star-bold-duotone',
      title: 'Prize Distribution',
      value: DISTRIBUTION_NAMES[state.distributionRule as keyof typeof DISTRIBUTION_NAMES] || 'Not selected',
      color: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="inline-block"
        >
          <div className="rounded-full bg-success-100 dark:bg-success-900/30 p-4 mb-3">
            <Icon icon="solar:check-circle-bold-duotone" width={48} className="text-success-600" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold">Review Your Selections</h3>
        <p className="text-default-600">
          Confirm your match preferences before finding a game
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 bg-${section.color}-100 dark:bg-${section.color}-900/30`}>
                    <Icon
                      icon={section.icon}
                      width={24}
                      className={`text-${section.color}-600`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                      {section.title}
                    </p>
                    <p className="text-base font-semibold text-foreground mt-1">
                      {section.value}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Match Details Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 border-2 border-warning-200 dark:border-warning-800">
          <CardHeader className="flex-col items-start gap-2 pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:info-circle-bold-duotone" width={20} className="text-warning-600" />
              <h4 className="font-semibold text-warning-700 dark:text-warning-400">Match Information</h4>
            </div>
          </CardHeader>
          <Divider className="bg-warning-200 dark:bg-warning-800" />
          <CardBody className="gap-3 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-700">Expected Pool Size:</span>
              <Chip size="sm" variant="flat" color="warning" className="font-semibold">
                ${state.expectedPool?.toFixed(2) || '100.00'}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-700">Match Type:</span>
              <Chip size="sm" variant="flat" color="primary">
                {state.tier ? state.tier.charAt(0).toUpperCase() + state.tier.slice(1) : 'Ranked'}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-700">Region:</span>
              <Chip size="sm" variant="flat">
                {state.region || 'N/A'}
              </Chip>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Ready to Play Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 p-4 rounded-lg bg-success-100 dark:bg-success-900/30 border border-success-300 dark:border-success-700"
      >
        <Icon icon="solar:play-circle-bold" width={24} className="text-success-600 animate-pulse" />
        <span className="font-semibold text-success-700 dark:text-success-400">
          Ready to find your match!
        </span>
      </motion.div>

      {/* Matchmaking Status */}
      {state.matchmaking?.isSearching && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-800">
            <CardBody className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-2">
                  Finding Your Match
                </h4>
                <div className="space-y-2 text-sm text-default-700">
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="solar:users-group-rounded-bold" width={16} />
                    <span>Queue Position: <strong>#{state.matchmaking.queuePosition}</strong></span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="solar:clock-circle-bold" width={16} />
                    <span>Estimated Wait: <strong>{Math.floor(state.matchmaking.estimatedWait / 60)}m {state.matchmaking.estimatedWait % 60}s</strong></span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="solar:hourglass-bold" width={16} />
                    <span>Elapsed Time: <strong>{Math.floor(state.matchmaking.elapsedTime / 60)}m {state.matchmaking.elapsedTime % 60}s</strong></span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Error Display */}
      {state.matchmaking?.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-danger-50 dark:bg-danger-900/20 border-2 border-danger-200 dark:border-danger-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="solar:danger-circle-bold" width={24} className="text-danger-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-danger-700 dark:text-danger-400">Matchmaking Error</p>
                  <p className="text-sm text-danger-600 dark:text-danger-500">{state.matchmaking.error}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Tips */}
      {!state.matchmaking?.isSearching && (
        <Card className="bg-default-50 dark:bg-default-900/20">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <Icon icon="solar:lightbulb-bolt-bold-duotone" width={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-default-600">
                <p className="font-semibold text-default-700">Pro Tips:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Make sure your squad is ready before searching</li>
                  <li>Your selected region affects matchmaking speed</li>
                  <li>Prize distribution is locked once the match starts</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
